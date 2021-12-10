import { useApolloClient } from '@apollo/client'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

import {
  GetDistributionBucketsWithOperatorsDocument,
  GetDistributionBucketsWithOperatorsQuery,
  GetDistributionBucketsWithOperatorsQueryVariables,
} from '@/api/queries'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { DistributorInfo } from '@/types/storage'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

type DistributorsMapping = Record<string, DistributorInfo[]>

type DistributorsContextValue = {
  distributorsMappingPromiseRef: React.MutableRefObject<Promise<DistributorsMapping> | undefined>
}
const DistributorsContext = React.createContext<DistributorsContextValue | undefined>(undefined)
DistributorsContext.displayName = 'DistributorsContext'

export const DistributorsContextProvider: React.FC = ({ children }) => {
  const distributorsMappingPromiseRef = useRef<Promise<DistributorsMapping>>()
  const [distributorsError, setDistributorsError] = useState<unknown>(null)

  const client = useApolloClient()

  // runs once - fetch all the distributors and create DistributorsMapping
  useEffect(() => {
    const distributorsPromise = client.query<
      GetDistributionBucketsWithOperatorsQuery,
      GetDistributionBucketsWithOperatorsQueryVariables
    >({
      query: GetDistributionBucketsWithOperatorsDocument,
      fetchPolicy: 'network-only',
    })
    distributorsMappingPromiseRef.current = distributorsPromise.then((result) => {
      const mapping: DistributorsMapping = {}
      const buckets = result.data.distributionBuckets
      buckets.forEach((bucket) => {
        const bagIds = bucket.bags.map((bag) => bag.id)
        const endpoints: DistributorInfo[] = bucket.operators
          .filter((operator) => operator && operator.metadata)
          .map((operator) => ({ id: operator.id, endpoint: operator.metadata?.nodeEndpoint || '' }))

        bagIds.forEach((bagId) => {
          if (!mapping[bagId]) {
            mapping[bagId] = endpoints
          } else {
            // TODO: make sure endpoints are unique
            mapping[bagId] = [...mapping[bagId], ...endpoints]
          }
        })
      })
      return mapping
    })
    distributorsPromise.catch((error) => {
      SentryLogger.error('Failed to fetch storage providers list', 'StorageProvidersProvider', error)
      setDistributorsError(error)
    })
  }, [client])

  if (distributorsError) {
    return <ViewErrorFallback />
  }

  return (
    <DistributorsContext.Provider value={{ distributorsMappingPromiseRef }}>{children}</DistributorsContext.Provider>
  )
}

export const useDistributors = () => {
  const ctx = useContext(DistributorsContext)

  if (!ctx) {
    throw new Error('useDistributors must be used within DistributorsContext')
  }

  const { distributorsMappingPromiseRef } = ctx

  const getAllDistributors = useCallback(
    async (storageBagId: string) => {
      try {
        const distributorsMapping = (await distributorsMappingPromiseRef.current) || {}
        const distributors = distributorsMapping[storageBagId]
        if (!distributors || !distributors.length) {
          ConsoleLogger.warn('Missing distributors for storage bag', { storageBagId })
          return null
        }
        return distributors
      } catch {
        // error is handled by the context
        return null
      }
    },
    [distributorsMappingPromiseRef]
  )

  return { getAllDistributors }
}
