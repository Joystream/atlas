import { useApolloClient } from '@apollo/client'
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
import { useMutation } from 'react-query'
import { useLocation } from 'react-router'

import { axiosInstance } from '@/api/axios'
import {
  GetAvailableStorageBucketsForBagDocument,
  GetAvailableStorageBucketsForBagQuery,
  GetAvailableStorageBucketsForBagQueryVariables,
  GetStorageBucketsWithBagsDocument,
  GetStorageBucketsWithBagsQuery,
  GetStorageBucketsWithBagsQueryVariables,
} from '@/api/queries/__generated__/storage.generated'
import { useGetBasicVideosLazyQuery } from '@/api/queries/__generated__/videos.generated'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMountEffect } from '@/hooks/useMountEffect'
import { getFastestImageUrl } from '@/providers/assets/assets.helpers'
import { UserCoordinates, useUserLocationStore } from '@/providers/userLocation'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { OperatorInfo } from './assets.types'

type BagOperatorsMapping = Record<string, OperatorInfo[]>

type OperatorsContextValue = {
  storageOperatorsMappingPromiseRef: MutableRefObject<Promise<BagOperatorsMapping> | undefined>
  failedStorageOperatorIds: string[]
  setFailedStorageOperatorIds: Dispatch<SetStateAction<string[]>>
  fetchStorageOperators: () => Promise<BagOperatorsMapping>
  userBenchmarkTime: number | null
}
export const OperatorsContext = createContext<OperatorsContextValue | undefined>(undefined)
OperatorsContext.displayName = 'OperatorsContext'

export const OperatorsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const storageOperatorsMappingPromiseRef = useRef<Promise<BagOperatorsMapping>>()
  const [storageOperatorsError, setStorageOperatorsError] = useState<unknown>(null)
  const [failedStorageOperatorIds, setFailedStorageOperatorIds] = useState<string[]>([])
  const [userBenchmarkTime, setUserBenchmarkTime] = useState<number | null>(null)
  const [getBasicVideo] = useGetBasicVideosLazyQuery()
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
      fetchPolicy: 'network-only',
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
    const initBenchmark = async () => {
      const { data } = await getBasicVideo({
        variables: {
          limit: 1,
          where: {
            thumbnailPhoto: {
              isAccepted_eq: true,
            },
          },
        },
      })
      const thumbnail = data?.videos[0].thumbnailPhoto
      if (thumbnail) {
        const promiseRace = getFastestImageUrl(thumbnail.resolvedUrls)
        const startTime = performance.now()
        await promiseRace
        const msDuration = performance.now() - startTime
        const previousTimeout = userBenchmarkTime ?? atlasConfig.storage.assetResponseTimeout
        if (msDuration > previousTimeout || msDuration < previousTimeout / 2) {
          setUserBenchmarkTime((msDuration + previousTimeout) * 0.75)
        }
      }
    }
    initBenchmark()
    const id = setInterval(initBenchmark, 30 * 1_000)
    return () => {
      clearInterval(id)
    }
  })

  if (storageOperatorsError) {
    return <ViewErrorFallback />
  }

  return (
    <OperatorsContext.Provider
      value={{
        storageOperatorsMappingPromiseRef,
        failedStorageOperatorIds,
        setFailedStorageOperatorIds,
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
      setFailedStorageOperatorIds((state) => [...state, operatorId])
    },
    [setFailedStorageOperatorIds]
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
