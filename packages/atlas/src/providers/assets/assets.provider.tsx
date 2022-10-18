import { useApolloClient } from '@apollo/client'
import axios from 'axios'
import haversine from 'haversine-distance'
import { uniqBy } from 'lodash-es'
import {
  Dispatch,
  FC,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'react-router'

import {
  GetDistributionBucketsWithBagsDocument,
  GetDistributionBucketsWithBagsQuery,
  GetDistributionBucketsWithBagsQueryVariables,
  GetStorageBucketsWithBagsDocument,
  GetStorageBucketsWithBagsQuery,
  GetStorageBucketsWithBagsQueryVariables,
} from '@/api/queries/__generated__/storage.generated'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMountEffect } from '@/hooks/useMountEffect'
import { UserCoordinates, useUserLocationStore } from '@/providers/userLocation'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { getRandomIntInclusive } from '@/utils/number'

import { OperatorInfo } from './assets.types'

type BagOperatorsMapping = Record<string, OperatorInfo[]>

type OperatorsContextValue = {
  distributionOperatorsMappingPromiseRef: MutableRefObject<Promise<BagOperatorsMapping> | undefined>
  storageOperatorsMappingPromiseRef: MutableRefObject<Promise<BagOperatorsMapping> | undefined>
  failedStorageOperatorIds: string[]
  setFailedStorageOperatorIds: Dispatch<SetStateAction<string[]>>
  fetchOperators: () => Promise<void>
  tryRefetchDistributionOperators: () => Promise<boolean>
}
const OperatorsContext = createContext<OperatorsContextValue | undefined>(undefined)
OperatorsContext.displayName = 'OperatorsContext'

export const OperatorsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const distributionOperatorsMappingPromiseRef = useRef<Promise<BagOperatorsMapping>>()
  const storageOperatorsMappingPromiseRef = useRef<Promise<BagOperatorsMapping>>()
  const lastDistributionOperatorsFetchTimeRef = useRef<number>(Number.MAX_SAFE_INTEGER)
  const isFetchingDistributionOperatorsRef = useRef(false)
  const [distributionOperatorsError, setDistributionOperatorsError] = useState<unknown>(null)
  const [storageOperatorsError, setStorageOperatorsError] = useState<unknown>(null)
  const [failedStorageOperatorIds, setFailedStorageOperatorIds] = useState<string[]>([])
  const {
    coordinates,
    expiry,
    disableUserLocation,
    actions: { setUserLocation },
  } = useUserLocationStore()

  const client = useApolloClient()

  const fetchDistributionOperators = useCallback(async () => {
    const now = new Date()
    let userCoordinates: UserCoordinates | null = null
    const distributionOperatorsPromise = client.query<
      GetDistributionBucketsWithBagsQuery,
      GetDistributionBucketsWithBagsQueryVariables
    >({
      query: GetDistributionBucketsWithBagsDocument,
      fetchPolicy: 'network-only',
    })
    if ((!coordinates || !expiry || now.getTime() > expiry) && !disableUserLocation) {
      try {
        const userCoordinatesResponse = await axios.get<UserCoordinates>(atlasConfig.storage.geolocationServiceUrl)
        userCoordinates = userCoordinatesResponse.data
        setUserLocation(userCoordinates)
      } catch (error) {
        SentryLogger.error('Failed to get user coordinates', 'operatorsProvider', error, {
          request: { url: atlasConfig.storage.geolocationServiceUrl },
        })
      }
    } else {
      userCoordinates = coordinates
    }
    isFetchingDistributionOperatorsRef.current = true
    lastDistributionOperatorsFetchTimeRef.current = new Date().getTime()
    distributionOperatorsMappingPromiseRef.current = distributionOperatorsPromise.then((result) => {
      const mapping: BagOperatorsMapping = {}
      const buckets = result.data.distributionBuckets
      buckets.forEach((bucket) => {
        const bagIds = bucket.bags.map((bag) => bag.id)

        // we need to filter operators manually as query node doesn't support filtering this deep
        const operatorsInfos: OperatorInfo[] = bucket.operators
          .filter((operator) => operator.metadata?.nodeEndpoint?.includes('http') && operator.status === 'ACTIVE')
          .map((operator) => {
            const coordinates = operator.metadata?.nodeLocation?.coordinates
            return {
              id: operator.id,
              endpoint: operator.metadata?.nodeEndpoint || '',
              distance:
                coordinates && userCoordinates
                  ? haversine(
                      { lat: userCoordinates.latitude, lng: userCoordinates.longitude },
                      {
                        lat: coordinates.latitude,
                        lng: coordinates.longitude,
                      }
                    )
                  : null,
            }
          })

        bagIds.forEach((bagId) => {
          if (!mapping[bagId]) {
            mapping[bagId] = operatorsInfos
          } else {
            mapping[bagId] = [...mapping[bagId], ...operatorsInfos]
          }
        })
      })
      isFetchingDistributionOperatorsRef.current = false
      return removeBagOperatorsDuplicates(mapping)
    })
    distributionOperatorsPromise.catch((error) => {
      SentryLogger.error('Failed to fetch distribution operators', 'OperatorsContextProvider', error)
      setDistributionOperatorsError(error)
      isFetchingDistributionOperatorsRef.current = false
    })
    return distributionOperatorsMappingPromiseRef.current
  }, [client, coordinates, disableUserLocation, expiry, setUserLocation])

  const fetchStorageOperators = useCallback(() => {
    const storageOperatorsPromise = client.query<
      GetStorageBucketsWithBagsQuery,
      GetStorageBucketsWithBagsQueryVariables
    >({
      query: GetStorageBucketsWithBagsDocument,
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
    return storageOperatorsMappingPromiseRef.current
  }, [client])

  const fetchOperators = useCallback(async () => {
    await Promise.all([fetchDistributionOperators(), fetchStorageOperators()])
  }, [fetchDistributionOperators, fetchStorageOperators])

  const tryRefetchDistributionOperators = useCallback(async () => {
    const currentTime = new Date().getTime()

    if (isFetchingDistributionOperatorsRef.current) {
      await distributionOperatorsMappingPromiseRef
      return true
    }

    if (
      currentTime - lastDistributionOperatorsFetchTimeRef.current <
      atlasConfig.storage.minimumDistributorRefetchTime
    ) {
      return false
    }

    ConsoleLogger.log('Refetching distribution operators')
    await fetchDistributionOperators()
    return true
  }, [fetchDistributionOperators])

  // runs once - fetch distribution operators and create associated mappings
  useMountEffect(() => {
    fetchDistributionOperators()
  })

  const { pathname } = useLocation()
  const hasFetchedStorageProvidersRef = useRef(false)
  const isStudio = pathname.search(absoluteRoutes.studio.index()) !== -1
  // runs once - fetch storage operators and create associated mappings, but only if user is in the Studio
  useEffect(() => {
    if (hasFetchedStorageProvidersRef.current || !isStudio) return

    hasFetchedStorageProvidersRef.current = true

    fetchStorageOperators()
  }, [fetchStorageOperators, isStudio])

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
        fetchOperators,
        tryRefetchDistributionOperators,
      }}
    >
      {children}
    </OperatorsContext.Provider>
  )
}

export const useOperatorsContext = () => {
  const ctx = useContext(OperatorsContext)

  if (!ctx) {
    throw new Error('useOperatorsContext must be used within OperatorsContext')
  }

  return ctx
}

export const useDistributionOperators = () => {
  const { distributionOperatorsMappingPromiseRef } = useOperatorsContext()

  const getAllDistributionOperatorsForBag = useCallback(
    async (storageBagId: string) => {
      try {
        const distributionOperatorsMapping = (await distributionOperatorsMappingPromiseRef.current) || {}
        const bagOperators = distributionOperatorsMapping[storageBagId]
        if (!bagOperators || !bagOperators.length) {
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
  const { storageOperatorsMappingPromiseRef, failedStorageOperatorIds, setFailedStorageOperatorIds } =
    useOperatorsContext()

  const getAllStorageOperatorsForBag = useCallback(
    async (storageBagId: string, includeFailed = false) => {
      try {
        const storageOperatorsMapping = (await storageOperatorsMappingPromiseRef.current) || {}
        const bagOperators = storageOperatorsMapping[storageBagId]
        if (includeFailed) {
          return bagOperators
        }
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
