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
  GetDistributionBucketsByBagIdsDocument,
  GetDistributionBucketsByBagIdsQuery,
  GetDistributionBucketsByBagIdsQueryVariables,
  GetStorageBucketsWithBagsDocument,
  GetStorageBucketsWithBagsQuery,
  GetStorageBucketsWithBagsQueryVariables,
} from '@/api/queries/__generated__/storage.generated'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { UserCoordinates, useUserLocationStore } from '@/providers/userLocation'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { OperatorInfo } from './assets.types'

type BagOperatorsMapping = Record<string, OperatorInfo[]>

type OperatorsContextValue = {
  fetchDistributionBucketsForBags: (ids: string[]) => Promise<BagOperatorsMapping>
  distributionOperatorsMappingPromiseRef: MutableRefObject<Promise<BagOperatorsMapping> | undefined>
  storageOperatorsMappingPromiseRef: MutableRefObject<Promise<BagOperatorsMapping> | undefined>
  failedStorageOperatorIds: string[]
  setFailedStorageOperatorIds: Dispatch<SetStateAction<string[]>>
  fetchOperators: () => Promise<void>
  tryRefetchDistributionOperators: (bagIds: string[]) => Promise<BagOperatorsMapping | null>
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

  const getUserCoordinates = useCallback(async () => {
    const now = new Date()
    if (
      (!coordinates || !expiry || now.getTime() > expiry) &&
      !disableUserLocation &&
      atlasConfig.storage.geolocationServiceUrl
    ) {
      try {
        const userCoordinatesResponse = await axios.get<UserCoordinates>(atlasConfig.storage.geolocationServiceUrl)
        setUserLocation(userCoordinatesResponse.data)
        return userCoordinatesResponse.data
      } catch (error) {
        SentryLogger.error('Failed to get user coordinates', 'operatorsProvider', error, {
          request: { url: atlasConfig.storage.geolocationServiceUrl },
        })
      }
    }
    return coordinates
  }, [coordinates, disableUserLocation, expiry, setUserLocation])

  const fetchDistributionBucketsForBags = useCallback(
    async (ids: string[]) => {
      const fetchDistributionBucketsForBagsPromise = client.query<
        GetDistributionBucketsByBagIdsQuery,
        GetDistributionBucketsByBagIdsQueryVariables
      >({
        query: GetDistributionBucketsByBagIdsDocument,
        fetchPolicy: 'network-only',
        variables: { bagIds: ids },
      })
      isFetchingDistributionOperatorsRef.current = true
      lastDistributionOperatorsFetchTimeRef.current = new Date().getTime()

      const userCoordinates = await getUserCoordinates()

      const mapping: BagOperatorsMapping = {}

      distributionOperatorsMappingPromiseRef.current = fetchDistributionBucketsForBagsPromise.then((res) => {
        const storageBags = res.data.storageBags

        storageBags.forEach((bag) => {
          const bagId = bag.id
          bag.distributionBuckets.forEach((bucket) => {
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
            if (!mapping[bagId]) {
              mapping[bagId] = operatorsInfos
            } else {
              mapping[bagId] = [...mapping[bagId], ...operatorsInfos]
            }
          })
        })
        return removeBagOperatorsDuplicates(mapping)
      })
      fetchDistributionBucketsForBagsPromise.catch((error) => {
        SentryLogger.error('Failed to fetch distribution operators', 'OperatorsContextProvider', error)
        setDistributionOperatorsError(error)
        isFetchingDistributionOperatorsRef.current = false
      })

      return distributionOperatorsMappingPromiseRef.current
    },
    [client, getUserCoordinates]
  )

  const fetchStorageOperators = useCallback(async () => {
    const storageOperatorsPromise = client.query<
      GetStorageBucketsWithBagsQuery,
      GetStorageBucketsWithBagsQueryVariables
    >({
      query: GetStorageBucketsWithBagsDocument,
      fetchPolicy: 'network-only',
    })
    const userCoordinates = await getUserCoordinates()

    storageOperatorsMappingPromiseRef.current = storageOperatorsPromise.then((result) => {
      const mapping: BagOperatorsMapping = {}
      const buckets = result.data.storageBuckets
      buckets.forEach((bucket) => {
        const bagIds = bucket.bags.map((bag) => bag.id)

        const endpoint = bucket.operatorMetadata?.nodeEndpoint
        if (!endpoint) {
          return
        }
        const operatorCoordinates = bucket.operatorMetadata?.nodeLocation?.coordinates
        const operatorInfo: OperatorInfo = {
          id: bucket.id,
          endpoint,
          distance:
            operatorCoordinates && userCoordinates
              ? haversine(
                  { lat: userCoordinates.latitude, lng: userCoordinates.longitude },
                  {
                    lat: operatorCoordinates.latitude,
                    lng: operatorCoordinates.longitude,
                  }
                )
              : null,
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
  }, [client, getUserCoordinates])

  const fetchOperators = useCallback(async () => {
    await fetchStorageOperators()
  }, [fetchStorageOperators])

  const tryRefetchDistributionOperators = useCallback(
    async (bagIds: string[]) => {
      const currentTime = new Date().getTime()

      if (isFetchingDistributionOperatorsRef.current) {
        return null
      }

      if (
        currentTime - lastDistributionOperatorsFetchTimeRef.current <
        atlasConfig.storage.minimumDistributorRefetchTime
      ) {
        return null
      }

      ConsoleLogger.log('Refetching distribution operators')
      return await fetchDistributionBucketsForBags(bagIds)
    },
    [fetchDistributionBucketsForBags]
  )

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
        fetchDistributionBucketsForBags,
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
  // const { distributionOperatorsMappingPromiseRef } = useOperatorsContext()

  const { fetchDistributionBucketsForBags } = useOperatorsContext()

  const getAllDistributionOperatorsForBags = useCallback(
    async (storageBagId: string[]) => {
      try {
        const distributionOperatorsMapping = (await fetchDistributionBucketsForBags(storageBagId)) || {}

        return distributionOperatorsMapping
      } catch {
        // error is handled by the context
        return null
      }
    },
    [fetchDistributionBucketsForBags]
  )

  return { getAllDistributionOperatorsForBags }
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

  const getClosestStorageOperatorForBag = useCallback(
    async (storageBagId: string) => {
      const workingStorageOperators = await getAllStorageOperatorsForBag(storageBagId)
      if (!workingStorageOperators || !workingStorageOperators.length) {
        return null
      }
      return workingStorageOperators.sort((a, b) => {
        if (!b.distance) {
          return -1
        }
        if (!a.distance) {
          return 1
        }
        return a.distance - b.distance
      })[0]
    },
    [getAllStorageOperatorsForBag]
  )

  const markStorageOperatorFailed = useCallback(
    (operatorId: string) => {
      setFailedStorageOperatorIds((state) => [...state, operatorId])
    },
    [setFailedStorageOperatorIds]
  )

  return { getAllStorageOperatorsForBag, getClosestStorageOperatorForBag, markStorageOperatorFailed }
}

const removeBagOperatorsDuplicates = (mapping: BagOperatorsMapping): BagOperatorsMapping => {
  return Object.entries(mapping).reduce((acc, [bagId, operators]) => {
    acc[bagId] = uniqBy(operators, (operator) => operator.id)
    return acc
  }, {} as BagOperatorsMapping)
}
