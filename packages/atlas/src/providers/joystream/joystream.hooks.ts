import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { sampleSize } from 'lodash-es'
import { useCallback, useContext, useEffect, useRef } from 'react'

import {
  GetBasicDistributionBucketsDocument,
  GetBasicDistributionBucketsQuery,
  GetBasicDistributionBucketsQueryVariables,
  GetBasicStorageBucketsDocument,
  GetBasicStorageBucketsQuery,
  GetBasicStorageBucketsQueryVariables,
} from '@/api/queries'
import { ChannelInputBuckets } from '@/joystream-lib'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/utils/number'

import { JoystreamContext, JoystreamContextValue } from './joystream.provider'

export const useJoystream = (): JoystreamContextValue => {
  const ctx = useContext(JoystreamContext)
  if (!ctx) {
    throw new Error('useJoystream must be used within JoystreamProvider')
  }
  return ctx
}

export const useTokenPrice = () => {
  const { tokenPrice } = useJoystream()
  const convertToUSD = useCallback(
    (tokens: BN) => {
      return tokenPrice ? hapiBnToTokenNumber(tokens) * tokenPrice : null
    },
    [tokenPrice]
  )
  const convertToTokenPrice = useCallback(
    (dollars: number) => {
      if (!tokenPrice) return new BN(0)
      return tokenNumberToHapiBn(dollars / tokenPrice)
    },
    [tokenPrice]
  )
  const isLoadingPrice = tokenPrice === 0

  return {
    convertToUSD,
    convertToTokenPrice,
    isLoadingPrice,
  }
}

export const useBucketsConfigForNewChannel = () => {
  const allStorageBuckets = useRef<number[]>()
  const allDistributionFamiliesToBucketsMapping = useRef<Record<number, number[]>>()
  const { joystream } = useJoystream()

  const client = useApolloClient()

  // get all storage buckets
  useEffect(() => {
    const storageBucketsPromise = client.query<GetBasicStorageBucketsQuery, GetBasicStorageBucketsQueryVariables>({
      query: GetBasicStorageBucketsDocument,
      fetchPolicy: 'network-only',
    })

    storageBucketsPromise.then(({ data }) => {
      allStorageBuckets.current = (data as GetBasicStorageBucketsQuery).storageBuckets.map(({ id }) => parseInt(id))
    })
  }, [client])

  // get all distribution buckets
  useEffect(() => {
    const distributionBucketsPromise = client.query<
      GetBasicDistributionBucketsQuery,
      GetBasicDistributionBucketsQueryVariables
    >({
      query: GetBasicDistributionBucketsDocument,
      fetchPolicy: 'network-only',
    })

    distributionBucketsPromise.then(({ data }) => {
      allDistributionFamiliesToBucketsMapping.current = (
        data as GetBasicDistributionBucketsQuery
      ).distributionBuckets.reduce((acc, cur) => {
        const familyId = parseInt(cur.family.id)
        if (!acc[familyId]) {
          acc[familyId] = []
        }

        acc[familyId].push(cur.bucketIndex)

        return acc
      }, {} as Record<number, number[]>)
    })
  }, [client])

  const getBucketsConfigForNewChannel = useCallback(async (): Promise<ChannelInputBuckets> => {
    const dynamicBagCreationPolicies = await joystream?.getDynamicBagCreationPolicies()
    const storageBuckets = allStorageBuckets.current
    const distributionFamiliesToBucketsMapping = allDistributionFamiliesToBucketsMapping.current
    const storage =
      storageBuckets && dynamicBagCreationPolicies?.numberOfStorageBuckets
        ? sampleSize(storageBuckets, dynamicBagCreationPolicies.numberOfStorageBuckets)
        : []
    const distribution = distributionFamiliesToBucketsMapping
      ? Object.entries(distributionFamiliesToBucketsMapping).reduce((acc, [familyIdStr, buckets]) => {
          const familyId = parseInt(familyIdStr)
          const familyBuckets: ChannelInputBuckets['distribution'] = dynamicBagCreationPolicies?.families
            ? sampleSize(buckets, dynamicBagCreationPolicies.families[familyId]).map((bucketIndex) => ({
                distributionBucketIndex: bucketIndex,
                distributionBucketFamilyId: familyId,
              }))
            : []
          return [...acc, ...familyBuckets]
        }, [] as ChannelInputBuckets['distribution'])
      : []

    return {
      storage: storage.length ? storage : [0],
      distribution: distribution.length
        ? distribution
        : [{ distributionBucketFamilyId: 0, distributionBucketIndex: 0 }],
    }
  }, [joystream])

  return getBucketsConfigForNewChannel
}
