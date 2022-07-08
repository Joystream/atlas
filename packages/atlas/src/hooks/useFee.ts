import debouncePromise from 'awesome-debounce-promise'
import { useEffect, useMemo, useState } from 'react'

import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { useJoystream } from '@/providers/joystream'

import { useSubscribeAccountBalance } from './useSubscribeAccountBalance'

type Method = InstanceType<typeof JoystreamLibExtrinsics>

export type FeeMethod = Pick<
  Method,
  | 'getIssueNftFee'
  | 'getAcceptNftBidFee'
  | 'getBuyNftNowFee'
  | 'getMakeNftBidFee'
  | 'getCreateVideoFee'
  | 'getDeleteVideoFee'
  | 'getUpdateVideoFee'
  | 'getCancelNftBidFee'
  | 'getPutNftOnSaleFee'
  | 'getUpdateMemberFee'
  | 'getCancelNftSaleFee'
  | 'getCreateChannelFee'
  | 'getUpdateChannelFee'
  | 'getChangeNftPriceFee'
  | 'getSettleEnglishAuctionFee'
  | 'getCreateVideoCommentFee'
  | 'getDeleteVideoCommentFee'
  | 'getEditVideoCommentFee'
  | 'getModerateCommentFee'
  | 'getReactToVideoCommentFee'
  | 'getReactToVideoFee'
>

export type FeeMethodName = keyof FeeMethod

export const useFee = <TFnName extends FeeMethodName, TArgs extends Parameters<FeeMethod[TFnName]>>(
  methodName: TFnName,
  args?: TArgs
) => {
  const { joystream } = useJoystream()
  const accountBalance = useSubscribeAccountBalance()
  const [fee, setfee] = useState(0)

  const getFee = useMemo(
    () =>
      debouncePromise(async (args?: TArgs) => {
        if (!args) {
          return
        }
        // @ts-ignore Warning about not having spread argument as a tuple. We can ignore this
        const fee = await (await joystream?.extrinsics)?.[methodName](...args)
        if (fee) {
          setfee(fee)
        }
      }, 500),
    [joystream, methodName]
  )

  useEffect(() => {
    if (!args) {
      return
    }
    getFee(args)
  }, [args, getFee])

  return { fee, hasEnoughFunds: fee > (accountBalance || 0) }
}
