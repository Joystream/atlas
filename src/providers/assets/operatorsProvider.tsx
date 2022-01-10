import { useApolloClient } from '@apollo/client'
import { uniqBy } from 'lodash-es'
import React, { SetStateAction, useCallback, useContext, useEffect, useRef, useState } from 'react'

import {
  GetDistributionBucketsWithOperatorsDocument,
  GetDistributionBucketsWithOperatorsQuery,
  GetDistributionBucketsWithOperatorsQueryVariables,
  GetStorageBucketsDocument,
  GetStorageBucketsQuery,
  GetStorageBucketsQueryVariables,
} from '@/api/queries'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { getRandomIntInclusive } from '@/utils/number'

import { OperatorInfo } from './types'

type BagOperatorsMapping = Record<string, OperatorInfo[]>

type OperatorsContextValue = {
  distributionOperatorsMappingPromiseRef: React.MutableRefObject<Promise<BagOperatorsMapping> | undefined>
  storageOperatorsMappingPromiseRef: React.MutableRefObject<Promise<BagOperatorsMapping> | undefined>
  failedStorageOperatorIds: string[]
  setFailedStorageOperatorIds: React.Dispatch<SetStateAction<string[]>>
}
const OperatorsContext = React.createContext<OperatorsContextValue | undefined>(undefined)
OperatorsContext.displayName = 'OperatorsContext'

export const OperatorsContextProvider: React.FC = ({ children }) => {
  const distributionOperatorsMappingPromiseRef = useRef<Promise<BagOperatorsMapping>>()
  const storageOperatorsMappingPromiseRef = useRef<Promise<BagOperatorsMapping>>()
  const [distributionOperatorsError, setDistributionOperatorsError] = useState<unknown>(null)
  const [storageOperatorsError, setStorageOperatorsError] = useState<unknown>(null)
  const [failedStorageOperatorIds, setFailedStorageOperatorIds] = useState<string[]>([])

  const client = useApolloClient()

  // runs once - fetch all distribution operators and create associated mappings
  useEffect(() => {
    const distributionOperatorsPromise = client.query<
      GetDistributionBucketsWithOperatorsQuery,
      GetDistributionBucketsWithOperatorsQueryVariables
    >({
      query: GetDistributionBucketsWithOperatorsDocument,
      fetchPolicy: 'network-only',
    })
    distributionOperatorsMappingPromiseRef.current = distributionOperatorsPromise.then((result) => {
      const mapping: BagOperatorsMapping = {}
      const buckets = result.data.distributionBuckets
      buckets.forEach((bucket) => {
        const bagIds = bucket.bags.map((bag) => bag.id)

        // we need to filter operators manually as query node doesn't support filtering this deep
        const operatorsInfos: OperatorInfo[] = bucket.operators
          .filter((operator) => operator.metadata?.nodeEndpoint?.includes('http') && operator.status === 'ACTIVE')
          .map((operator) => ({ id: operator.id, endpoint: operator.metadata?.nodeEndpoint || '' }))

        bagIds.forEach((bagId) => {
          if (!mapping[bagId]) {
            mapping[bagId] = operatorsInfos
          } else {
            mapping[bagId] = [...mapping[bagId], ...operatorsInfos]
          }
        })
      })
      return removeBagOperatorsDuplicates(mapping)
    })
    distributionOperatorsPromise.catch((error) => {
      SentryLogger.error('Failed to fetch distribution operators', 'OperatorsContextProvider', error)
      setDistributionOperatorsError(error)
    })
  }, [client])

  // runs once - fetch all storage operators and create associated mappings
  useEffect(() => {
    const storageOperatorsPromise = client.query<GetStorageBucketsQuery, GetStorageBucketsQueryVariables>({
      query: GetStorageBucketsDocument,
      fetchPolicy: 'network-only',
    })
    storageOperatorsMappingPromiseRef.current = storageOperatorsPromise.then((result) => {
      const mapping: BagOperatorsMapping = {}
      const buckets = result.data.storageBuckets
      buckets.forEach((bucket) => {
        const bagIds = bucket.bags.map((bag) => bag.id)

        const endpoint = bucket.operatorMetadata?.nodeEndpoint
        if (!endpoint) {
          return
        }
        const operatorInfo: OperatorInfo = {
          id: bucket.id,
          endpoint,
        }

        bagIds.forEach((bagId) => {
          if (!mapping[bagId]) {
            mapping[bagId] = [operatorInfo]
          } else {
            mapping[bagId] = [...mapping[bagId], operatorInfo]
          }
        })
      })
      return removeBagOperatorsDuplicates(mapping)
    })
    storageOperatorsPromise.catch((error) => {
      SentryLogger.error('Failed to fetch storage operators', 'OperatorsContextProvider', error)
      setStorageOperatorsError(error)
    })
  }, [client])

  if (distributionOperatorsError || storageOperatorsError) {
    return <ViewErrorFallback />
  }

  return (
    <OperatorsContext.Provider
      value={{
        distributionOperatorsMappingPromiseRef,
        storageOperatorsMappingPromiseRef,
        failedStorageOperatorIds,
        setFailedStorageOperatorIds,
      }}
    >
      {children}
    </OperatorsContext.Provider>
  )
}

export const useDistributionOperators = () => {
  const ctx = useContext(OperatorsContext)

  if (!ctx) {
    throw new Error('useDistributionOperators must be used within OperatorsContext')
  }

  const { distributionOperatorsMappingPromiseRef } = ctx

  const getAllDistributionOperatorsForBag = useCallback(
    async (storageBagId: string) => {
      try {
        const distributionOperatorsMapping = (await distributionOperatorsMappingPromiseRef.current) || {}
        const bagOperators = distributionOperatorsMapping[storageBagId]
        if (!bagOperators || !bagOperators.length) {
          ConsoleLogger.warn('Missing distribution operators for storage bag', { storageBagId })
          return null
        }
        return bagOperators
      } catch {
        // error is handled by the context
        return null
      }
    },
    [distributionOperatorsMappingPromiseRef]
  )

  return { getAllDistributionOperatorsForBag }
}

export const useStorageOperators = () => {
  const ctx = useContext(OperatorsContext)

  if (!ctx) {
    throw new Error('useStorageOperators must be used within OperatorsContext')
  }

  const { storageOperatorsMappingPromiseRef, failedStorageOperatorIds, setFailedStorageOperatorIds } = ctx

  const getAllStorageOperatorsForBag = useCallback(
    async (storageBagId: string) => {
      try {
        const storageOperatorsMapping = (await storageOperatorsMappingPromiseRef.current) || {}
        const bagOperators = storageOperatorsMapping[storageBagId]
        const workingBagOperators = bagOperators.filter((operator) => !failedStorageOperatorIds.includes(operator.id))
        if (!workingBagOperators || !workingBagOperators.length) {
          ConsoleLogger.warn('Missing storage operators for storage bag', { storageBagId })
          return null
        }
        return workingBagOperators
      } catch {
        // error is handled by the context
        return null
      }
    },
    [failedStorageOperatorIds, storageOperatorsMappingPromiseRef]
  )

  const getRandomStorageOperatorForBag = useCallback(
    async (storageBagId: string) => {
      const workingStorageOperators = await getAllStorageOperatorsForBag(storageBagId)
      if (!workingStorageOperators || !workingStorageOperators.length) {
        return null
      }
      const randomStorageOperatorIdx = getRandomIntInclusive(0, workingStorageOperators.length - 1)
      return workingStorageOperators[randomStorageOperatorIdx]
    },
    [getAllStorageOperatorsForBag]
  )

  const markStorageOperatorFailed = useCallback(
    (operatorId: string) => {
      setFailedStorageOperatorIds((state) => [...state, operatorId])
    },
    [setFailedStorageOperatorIds]
  )

  return { getAllStorageOperatorsForBag, getRandomStorageOperatorForBag, markStorageOperatorFailed }
}

const removeBagOperatorsDuplicates = (mapping: BagOperatorsMapping): BagOperatorsMapping => {
  return Object.entries(mapping).reduce((acc, [bagId, operators]) => {
    acc[bagId] = uniqBy(operators, (operator) => operator.id)
    return acc
  }, {} as BagOperatorsMapping)
}
