import debouncePromise from 'awesome-debounce-promise'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ChannelInputAssets, TxMethodName, VideoInputAssets } from '@/joystream-lib'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'
import { hapiBnToTokenNumber } from '@/utils/number'

import { useSubscribeAccountBalance } from './useSubscribeAccountBalance'

export const useBloatFeesAndPerMbFees = (assets?: VideoInputAssets | ChannelInputAssets) => {
  const {
    chainState: {
      dataObjectPerMegabyteFee,
      dataObjectStateBloatBondValue,
      channelStateBloatBondValue,
      videoStateBloatBondValue,
    },
  } = useJoystream()

  const calculateFeePerMb = useCallback(
    (assets?: VideoInputAssets | ChannelInputAssets) => {
      if (!assets) {
        return
      }
      const totalBytes = Object.values(assets)
        .reduce((acc, asset) => {
          const bSize = new BN(asset.size)
          return acc.add(bSize)
        }, new BN(0))
        .toNumber()
      const totalStorageFee = new BN(dataObjectPerMegabyteFee).muln(Math.ceil(totalBytes / 1024 / 1024))

      return hapiBnToTokenNumber(totalStorageFee)
    },
    [dataObjectPerMegabyteFee]
  )

  const getTotalStateBloatBondFee = useCallback(
    (assets?: VideoInputAssets | ChannelInputAssets) => {
      if (!assets) {
        return
      }
      const totalStateBloatBond = new BN(dataObjectStateBloatBondValue).muln(Object.values(assets).length)
      return hapiBnToTokenNumber(totalStateBloatBond)
    },
    [dataObjectStateBloatBondValue]
  )

  return {
    totalFeePerMb: calculateFeePerMb(assets),
    totalStateBloatBondFee: getTotalStateBloatBondFee(assets),
    dataObjectStateBloatBondValue: hapiBnToTokenNumber(new BN(dataObjectStateBloatBondValue)),
    channelStateBloatBondValue: hapiBnToTokenNumber(new BN(channelStateBloatBondValue)),
    videoStateBloatBondValue: hapiBnToTokenNumber(new BN(videoStateBloatBondValue)),
  }
}

export const useFee = <TFnName extends TxMethodName, TArgs extends Parameters<JoystreamLibExtrinsics[TFnName]>>(
  methodName: TFnName,
  args?: TArgs,
  assets?: ChannelInputAssets | VideoInputAssets
) => {
  const { joystream } = useJoystream()

  const { totalFeePerMb, totalStateBloatBondFee, channelStateBloatBondValue, videoStateBloatBondValue } =
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
        if (methodName === 'createVideoTx') {
          videoOrChannelBloatFee = videoStateBloatBondValue
        }
        if (methodName === 'createChannelTx') {
          videoOrChannelBloatFee = channelStateBloatBondValue
        }

        const basicFee = await getBasicFee(args)

        if (basicFee) {
          const fullFee = new BigNumber(basicFee)
            .plus(new BigNumber(totalFeePerMb || 0))
            .plus(new BigNumber(totalStateBloatBondFee || 0))
            .plus(videoOrChannelBloatFee || 0)

          setFullfee(fullFee.toNumber())
        }
        setLoading(false)
      }, 500),
    [
      accountId,
      channelStateBloatBondValue,
      totalFeePerMb,
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
