import debouncePromise from 'awesome-debounce-promise'
import { useCallback, useEffect, useRef, useState } from 'react'

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
  const firstRender = useRef(true)

  const getFee = useCallback(
    async (args?: TArgs) => {
      if (!args) {
        setfee(0)
        return
      }
      // @ts-ignore Warning about not having spread argument as a tuple. We can ignore this
      const fee = await (await joystream?.extrinsics)?.[methodName](...args)
      if (fee) {
        setfee(fee)
      }
    },
    [joystream, methodName]
  )
  const debouncedGetFee = useRef(debouncePromise(getFee, 500))

  useEffect(() => {
    if (firstRender.current) {
      getFee(args)
      firstRender.current = false
    }
    debouncedGetFee.current(args)
  }, [args, getFee])

  return { fee, hasEnoughFunds: fee > (accountBalance || 0) }
}
