import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import BN from 'bn.js'
import { isEqual, sampleSize } from 'lodash-es'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  GetBasicDistributionBucketsDocument,
  GetBasicDistributionBucketsQuery,
  GetBasicDistributionBucketsQueryVariables,
  GetBasicStorageBucketsDocument,
  GetBasicStorageBucketsQuery,
  GetBasicStorageBucketsQueryVariables,
} from '@/api/queries/__generated__/storage.generated'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { ChannelInputAssets, ChannelInputBuckets, TxMethodName, VideoInputAssets } from '@/joystream-lib/types'
import {
  calculateAssetsBloatFee,
  calculateAssetsSizeFee,
  hapiBnToTokenNumber,
  tokenNumberToHapiBn,
} from '@/joystream-lib/utils'
import { useUser } from '@/providers/user/user.hooks'
import { ConsoleLogger } from '@/utils/logs'

import { useJoystream } from './joystream.provider'

const USE_FEE_DEBOUNCE = 500

export const useTokenPrice = () => {
  const { tokenPrice } = useJoystream()
  const convertHapiToUSD = useCallback(
    (hapis: BN) => {
      if (!tokenPrice) return null
      const tokens = hapiBnToTokenNumber(hapis)
      return tokens * tokenPrice
    },
    [tokenPrice]
  )

  const convertTokensToUSD = useCallback(
    (tokens: number) => {
      if (!tokenPrice) return null
      return tokens * tokenPrice
    },
    [tokenPrice]
  )
  const convertUSDToHapi = useCallback(
    (dollars: number) => {
      if (!tokenPrice) return new BN(0)
      return tokenNumberToHapiBn(dollars / tokenPrice)
    },
    [tokenPrice]
  )
  const isLoadingPrice = tokenPrice === 0

  return {
    convertHapiToUSD,
    convertTokensToUSD,
    convertUSDToHapi,
    tokenPrice,
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
      storageBuckets && dynamicBagCreationPolicies?.storageBucketsCount
        ? sampleSize(storageBuckets, dynamicBagCreationPolicies.storageBucketsCount)
        : []

    const distribution =
      dynamicBagCreationPolicies?.distributionBucketsCountPerFamily && distributionFamiliesToBucketsMapping
        ? Object.entries(dynamicBagCreationPolicies.distributionBucketsCountPerFamily).reduce(
            (acc, [familyIdStr, bucketsCount]) => {
              if (!bucketsCount) {
                return acc
              }
              const familyId = parseInt(familyIdStr)
              const familyBuckets: ChannelInputBuckets['distribution'] = sampleSize(
                distributionFamiliesToBucketsMapping[familyId],
                bucketsCount
              ).map((bucketIndex) => ({
                distributionBucketIndex: bucketIndex,
                distributionBucketFamilyId: familyId,
              }))

              return [...acc, ...familyBuckets]
            },
            [] as ChannelInputBuckets['distribution']
          )
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

type UseSubscribeAccountBalanceOpts = {
  channelStateBloatBond?: BN
}
export const useSubscribeAccountBalance = (
  controllerAccount?: string | null,
  opts?: UseSubscribeAccountBalanceOpts
) => {
  const [accountBalance, setAccountBalance] = useState<BN | undefined>()
  const [lockedAccountBalance, setLockedAccountBalance] = useState<BN | undefined>()
  const [totalInvitationLock, setTotalInvitationLock] = useState<BN | undefined>()
  const { activeMembership } = useUser()
  const { joystream, proxyCallback, chainState } = useJoystream()

  const totalBalanceLoaded = useMemo(
    () => accountBalance && lockedAccountBalance,
    [accountBalance, lockedAccountBalance]
  )
  const totalBalance = useMemo(
    () => (totalBalanceLoaded ? accountBalance?.add(lockedAccountBalance || new BN(0)) : undefined),
    [accountBalance, lockedAccountBalance, totalBalanceLoaded]
  )
  const debt = totalInvitationLock && lockedAccountBalance && totalInvitationLock.sub(lockedAccountBalance)

  useEffect(() => {
    if (!(controllerAccount || activeMembership?.controllerAccount) || !joystream) {
      return
    }

    let unsubscribe: (() => void) | undefined
    const init = async () => {
      unsubscribe = await joystream.subscribeAccountBalance(
        (controllerAccount || activeMembership?.controllerAccount) ?? '',
        proxyCallback(({ availableBalance, lockedBalance, totalInvitationLock }) => {
          setLockedAccountBalance(new BN(lockedBalance))
          setTotalInvitationLock(new BN(totalInvitationLock))
          if (opts?.channelStateBloatBond) {
            const rewardBalance = new BN(availableBalance).sub(opts.channelStateBloatBond)
            setAccountBalance(rewardBalance.gtn(0) ? rewardBalance : new BN(0))
            return
          }
          setAccountBalance(new BN(availableBalance))
        })
      )
    }
    init()

    return () => {
      unsubscribe?.()
    }
  }, [
    activeMembership,
    chainState.channelStateBloatBondValue,
    controllerAccount,
    joystream,
    opts?.channelStateBloatBond,
    proxyCallback,
  ])

  return { accountBalance, lockedAccountBalance, totalBalanceLoaded, totalBalance, debt, totalInvitationLock }
}

export const useBloatFeesAndPerMbFees = (assets?: VideoInputAssets | ChannelInputAssets) => {
  const {
    chainState: {
      dataObjectPerMegabyteFee,
      dataObjectStateBloatBondValue,
      channelStateBloatBondValue,
      videoStateBloatBondValue,
    },
  } = useJoystream()

  const totalAssetSizeFee = useMemo(
    () => calculateAssetsSizeFee(dataObjectPerMegabyteFee, assets),
    [assets, dataObjectPerMegabyteFee]
  )

  const totalAssetBloatFee = useMemo(
    () => calculateAssetsBloatFee(dataObjectStateBloatBondValue, assets),
    [assets, dataObjectStateBloatBondValue]
  )

  return {
    totalAssetSizeFee,
    totalAssetBloatFee,
    dataObjectStateBloatBondValue,
    channelStateBloatBondValue,
    videoStateBloatBondValue,
  }
}

export const useFee = <TFnName extends TxMethodName, TArgs extends Parameters<JoystreamLibExtrinsics[TFnName]>>(
  methodName?: TFnName,
  args?: TArgs,
  assets?: ChannelInputAssets | VideoInputAssets
) => {
  const { joystream } = useJoystream()

  const { totalAssetSizeFee, totalAssetBloatFee, channelStateBloatBondValue, videoStateBloatBondValue } =
    useBloatFeesAndPerMbFees(assets)

  const [fullFee, setFullFee] = useState(new BN(0))
  const [loading, setLoading] = useState(false)

  const { accountId } = useUser()

  const getTxFee = useCallback(
    async (args?: TArgs) => {
      const extrinsics = await joystream?.extrinsics
      if (!args || !accountId || !extrinsics || !methodName) {
        return new BN(0)
      }

      const strFee = await extrinsics.getFee(accountId, methodName, args)
      return new BN(strFee)
    },
    [accountId, joystream, methodName]
  )

  const updateFullFee = useMemo(
    () =>
      debouncePromise(async (args?: TArgs) => {
        if (!args || !accountId) {
          return
        }

        let videoOrChannelBloatFee = new BN(0)
        if (methodName === 'createVideoTx') {
          videoOrChannelBloatFee = videoStateBloatBondValue
        }
        if (methodName === 'createChannelTx') {
          videoOrChannelBloatFee = channelStateBloatBondValue
        }

        const txFee = await getTxFee(args)

        if (txFee.eqn(0)) {
          ConsoleLogger.warn('tx fee equal to 0')
        }

        const fullFee = txFee.add(totalAssetSizeFee).add(totalAssetBloatFee).add(videoOrChannelBloatFee)
        setFullFee(fullFee)
        setLoading(false)
      }, USE_FEE_DEBOUNCE),
    [
      accountId,
      channelStateBloatBondValue,
      totalAssetSizeFee,
      getTxFee,
      methodName,
      totalAssetBloatFee,
      videoStateBloatBondValue,
    ]
  )

  const argsRef = useRef<TArgs | undefined>()

  useEffect(() => {
    if (!args || isEqual(args, argsRef.current)) {
      return
    }
    argsRef.current = args
    setLoading(true)
    updateFullFee(args)
  }, [args, updateFullFee])

  // Prevents a render with `loading: false` and an old `fullFee`
  if (argsRef.current && !isEqual(args, argsRef.current)) {
    return {
      fullFee: new BN(0),
      getTxFee,
      loading: true,
    }
  }

  return {
    fullFee,
    getTxFee,
    loading,
  }
}
