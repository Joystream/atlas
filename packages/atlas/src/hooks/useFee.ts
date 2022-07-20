import debouncePromise from 'awesome-debounce-promise'
import { BN } from 'bn.js'
import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ChannelInputAssets, TxMethodName, VideoInputAssets } from '@/joystream-lib'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

import { useSubscribeAccountBalance } from './useSubscribeAccountBalance'

export const useFee = <TFnName extends TxMethodName, TArgs extends Parameters<JoystreamLibExtrinsics[TFnName]>>(
  methodName: TFnName,
  args?: TArgs,
  assets?: ChannelInputAssets | VideoInputAssets
) => {
  const { joystream } = useJoystream()

  const { feePerMb, totalStateBloatBondFee, channelStateBloatBondValue, videoStateBloatBondValue } =
    useBloatFeesAndPerMbFees(assets)
  const accountBalance = useSubscribeAccountBalance()
  const [fullFee, setFullfee] = useState(0)
  const [loading, setLoading] = useState(false)
  const argsRef = useRef(args)
  const { accountId } = useUser()

  const getBasicFee = useCallback(
    async (args?: TArgs) => {
      if (!args || !accountId) {
        return
      }

      const fee = await (await joystream?.extrinsics)?.getFee(accountId, methodName, args)
      return fee
    },
    [accountId, joystream, methodName]
  )

  const getFullFee = useMemo(
    () =>
      debouncePromise(async (args?: TArgs) => {
        if (!args || !accountId) {
          return
        }
        let videoOrChannelBloatFee = 0
        if (methodName === 'createVideoCommentTx') {
          videoOrChannelBloatFee = videoStateBloatBondValue
        }
        if (methodName === 'createChannelTx') {
          videoOrChannelBloatFee = channelStateBloatBondValue
        }

        const basicFee = await getBasicFee(args)

        if (basicFee) {
          setFullfee(basicFee + (feePerMb || 0) + (totalStateBloatBondFee || 0) + videoOrChannelBloatFee)
        }
        setLoading(false)
      }, 500),
    [
      accountId,
      channelStateBloatBondValue,
      feePerMb,
      getBasicFee,
      methodName,
      totalStateBloatBondFee,
      videoStateBloatBondValue,
    ]
  )

  useEffect(() => {
    if (!args || isEqual(args, argsRef.current)) {
      return
    }
    argsRef.current = args
    setLoading(true)
    getFullFee(args)
  }, [args, getFullFee])

  return {
    fullFee,
    getBasicFee,
    hasEnoughFunds: fullFee > (accountBalance || 0),
    loading,
  }
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

  const getFeePerMb = useCallback(
    (assets?: VideoInputAssets | ChannelInputAssets) => {
      if (!assets) {
        return
      }
      const totalBytes = Object.values(assets)
        .reduce((a, b) => {
          const bSize = new BN(b.size)
          return a.add(bSize)
        }, new BN(0))
        .toNumber()
      const totalStorageFee = new BN(dataObjectPerMegabyteFee).muln(Math.ceil(totalBytes / 1024 / 1024))

      return totalStorageFee.toNumber()
    },
    [dataObjectPerMegabyteFee]
  )

  const getTotalStateBloatBondFee = useCallback(
    (assets?: VideoInputAssets | ChannelInputAssets) => {
      if (!assets) {
        return
      }
      const totalStateBloatBond = new BN(dataObjectStateBloatBondValue).muln(Object.values(assets).length)
      return totalStateBloatBond.toNumber()
    },
    [dataObjectStateBloatBondValue]
  )

  return {
    feePerMb: getFeePerMb(assets),
    totalStateBloatBondFee: getTotalStateBloatBondFee(assets),
    getFeePerMb,
    getTotalStateBloatBondFee,
    channelStateBloatBondValue,
    videoStateBloatBondValue,
  }
}
