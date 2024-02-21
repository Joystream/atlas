import { useApolloClient } from '@apollo/client'
import haversine from 'haversine-distance'
import { uniqBy } from 'lodash-es'
import {
  FC,
  MutableRefObject,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useMutation } from 'react-query'
import { useLocation } from 'react-router'

import { axiosInstance } from '@/api/axios'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  GetAvailableStorageBucketsForBagDocument,
  GetAvailableStorageBucketsForBagQuery,
  GetAvailableStorageBucketsForBagQueryVariables,
  GetStorageBucketsWithBagsDocument,
  GetStorageBucketsWithBagsQuery,
  GetStorageBucketsWithBagsQueryVariables,
} from '@/api/queries/__generated__/storage.generated'
import { useGetBasicVideoActivityQuery } from '@/api/queries/__generated__/videos.generated'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMountEffect } from '@/hooks/useMountEffect'
import { getFastestImageUrl } from '@/providers/assets/assets.helpers'
import { UserCoordinates, useUserLocationStore } from '@/providers/userLocation'
import { ConsoleLogger, SentryLogger, UserEventsLogger } from '@/utils/logs'

import { OperatorInfo } from './assets.types'

type BagOperatorsMapping = Record<string, OperatorInfo[]>

type OperatorsContextValue = {
  storageOperatorsMappingPromiseRef: MutableRefObject<Promise<BagOperatorsMapping> | undefined>
  failedStorageOperatorIds: MutableRefObject<[string, number][]>
  addFailedStorageOperator: (id: string[]) => void
  fetchStorageOperators: () => Promise<BagOperatorsMapping>
  userBenchmarkTime: MutableRefObject<number | null>
}
export const OperatorsContext = createContext<OperatorsContextValue | undefined>(undefined)
OperatorsContext.displayName = 'OperatorsContext'

export const OperatorsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const storageOperatorsMappingPromiseRef = useRef<Promise<BagOperatorsMapping>>()
  const [storageOperatorsError, setStorageOperatorsError] = useState<unknown>(null)
  const failedStorageOperatorIds = useRef<[string, number][]>([]) // ID, timestamp of failure
  const userBenchmarkTime = useRef<number | null>(null)
  const { data: benchmarkData } = useGetBasicVideoActivityQuery({
    variables: {
      limit: 20,
      orderBy: [VideoOrderByInput.VideoRelevanceDesc],
      where: {
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
      },
    },
  })
  const {
    coordinates,
    expiry,
    disableUserLocation,
    actions: { setUserLocation },
  } = useUserLocationStore()
  const { mutateAsync: geolocationFetch } = useMutation('geolocation-fetch', () =>
    axiosInstance.get<UserCoordinates>(atlasConfig.storage.geolocationServiceUrl ?? '')
  )

  const client = useApolloClient()

  const getUserCoordinates = useCallback(async () => {
    const now = new Date()
    if (
      (!coordinates || !expiry || now.getTime() > expiry) &&
      !disableUserLocation &&
      atlasConfig.storage.geolocationServiceUrl
    ) {
      try {
        const userCoordinatesResponse = await geolocationFetch()
        setUserLocation(userCoordinatesResponse.data)
        return userCoordinatesResponse.data
      } catch (error) {
        SentryLogger.error('Failed to get user coordinates', 'operatorsProvider', error, {
          request: { url: atlasConfig.storage.geolocationServiceUrl },
        })
      }
    }
    return coordinates
  }, [coordinates, geolocationFetch, disableUserLocation, expiry, setUserLocation])

  const fetchStorageOperators = useCallback(async () => {
    const storageOperatorsPromise = client.query<
      GetStorageBucketsWithBagsQuery,
      GetStorageBucketsWithBagsQueryVariables
    >({
      query: GetStorageBucketsWithBagsDocument,
      fetchPolicy: 'no-cache',
    })
    const userCoordinates = await getUserCoordinates()

    storageOperatorsMappingPromiseRef.current = storageOperatorsPromise.then((result) => {
      const mapping: BagOperatorsMapping = {}
      const buckets = result.data.storageBuckets
      buckets.forEach((bucket) => {
        const bagIds = bucket.bags.map((distributionBucketBag) => distributionBucketBag.bag.id)

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

  const { pathname } = useLocation()
  const hasFetchedStorageProvidersRef = useRef(false)
  const isStudio = pathname.search(absoluteRoutes.studio.index()) !== -1
  // runs once - fetch storage operators and create associated mappings, but only if user is in the Studio
  useEffect(() => {
    if (hasFetchedStorageProvidersRef.current || !isStudio) return

    hasFetchedStorageProvidersRef.current = true

    fetchStorageOperators()
  }, [fetchStorageOperators, isStudio])

  useMountEffect(() => {
    getUserCoordinates()
  })

  useMountEffect(() => {
    const initBenchmark = async () => {
      const thumbnail = benchmarkData?.videos
        ? benchmarkData?.videos[Math.floor(Math.random() * benchmarkData.videos.length)].thumbnailPhoto
        : undefined

      if (thumbnail) {
        const promiseRace = getFastestImageUrl(thumbnail.resolvedUrls)
        const startTime = performance.now()
        await promiseRace
        const msDuration = performance.now() - startTime
        const previousTimeout = userBenchmarkTime.current ?? atlasConfig.storage.assetResponseTimeout
        if (msDuration > previousTimeout || msDuration < previousTimeout / 2) {
          const newTime = (msDuration + previousTimeout) * 0.75
          if (newTime > 20_000) {
            SentryLogger.message('User benchmark time is too high', 'OperatorsContextProvider', 'warning', {
              event: { 'userBenchmarkTime': newTime },
            })
          }
          UserEventsLogger.logUserBenchmarkTime(newTime)
          userBenchmarkTime.current = (msDuration + previousTimeout) * 0.75
        }
      }
    }
    initBenchmark()
    const id = setInterval(initBenchmark, 5 * 60 * 1_000)
    return () => {
      clearInterval(id)
    }
  })

  const addFailedStorageOperator = useCallback(
    (ids: string[]) => failedStorageOperatorIds.current.push(...ids.map((id) => [id, Date.now()] as [string, number])),
    []
  )

  if (storageOperatorsError) {
    return <ViewErrorFallback />
  }

  return (
    <OperatorsContext.Provider
      value={{
        storageOperatorsMappingPromiseRef,
        failedStorageOperatorIds,
        addFailedStorageOperator,
        fetchStorageOperators,
        userBenchmarkTime,
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

export const useStorageOperators = () => {
  const client = useApolloClient()
  const { storageOperatorsMappingPromiseRef, failedStorageOperatorIds, addFailedStorageOperator } =
    useOperatorsContext()

  const evaluateStorageOperators = useCallback(() => {
    failedStorageOperatorIds.current = failedStorageOperatorIds.current.filter(
      ([, timestamp]) => Date.now() - timestamp >= 1000 * 60 * 5 // if operator was marked failed more than 5 mins ago, try it again
    )
    return failedStorageOperatorIds.current
  }, [failedStorageOperatorIds])

  const getAllStorageOperatorsForBag = useCallback(
    async (storageBagId: string, includeFailed = false) => {
      try {
        const storageOperatorsMapping = (await storageOperatorsMappingPromiseRef.current) || {}
        const bagOperators = storageOperatorsMapping[storageBagId]
        if (includeFailed) {
          return bagOperators
        }

        const workingBagOperators = bagOperators.filter(
          (operator) => !evaluateStorageOperators().some(([id]) => operator.id === id)
        )

        if (!workingBagOperators || !workingBagOperators.length) {
          UserEventsLogger.logMissingOperatorsForBag(storageBagId)
          ConsoleLogger.warn('Missing storage operators for storage bag', { storageBagId })
          return null
        }
        return workingBagOperators
      } catch {
        // error is handled by the context
        return null
      }
    },
    [evaluateStorageOperators, storageOperatorsMappingPromiseRef]
  )

  const getAvailableBucketsCountForBag = useCallback(
    async (storageBagId: string) => {
      const getStorageBucketsForBagPromise = client.query<
        GetAvailableStorageBucketsForBagQuery,
        GetAvailableStorageBucketsForBagQueryVariables
      >({
        query: GetAvailableStorageBucketsForBagDocument,
        fetchPolicy: 'network-only',
        variables: { where: { bags_some: { id_contains: storageBagId } } },
      })

      const availableBucketsResult = await getStorageBucketsForBagPromise
      const storageBuckets = availableBucketsResult.data.storageBuckets

      return storageBuckets.length
    },
    [client]
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
      UserEventsLogger.logDistributorBlacklistedEvent({ distributorId: operatorId })
      addFailedStorageOperator([operatorId])
    },
    [addFailedStorageOperator]
  )

  return {
    getAllStorageOperatorsForBag,
    getClosestStorageOperatorForBag,
    markStorageOperatorFailed,
    getAvailableBucketsCountForBag,
  }
}

const removeBagOperatorsDuplicates = (mapping: BagOperatorsMapping): BagOperatorsMapping => {
  return Object.entries(mapping).reduce((acc, [bagId, operators]) => {
    acc[bagId] = uniqBy(operators, (operator) => operator.id)
    return acc
  }, {} as BagOperatorsMapping)
}
