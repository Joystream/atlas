import BN from 'bn.js'

import { GetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'
import { PaymentHistory } from '@/components/TablePaymentsHistory'

type CommonEvent = Pick<
  GetChannelPaymentEventsQuery['channelRewardClaimedEvents'][number],
  'createdAt' | 'inBlock' | 'amount'
>

export const mapEventToPaymentHistory = <T extends CommonEvent>(
  event: T,
  type: PaymentHistory['type']
): PaymentHistory => {
  const { inBlock, amount, createdAt } = event
  return {
    type,
    block: inBlock + 1,
    amount: new BN(amount),
    date: new Date(createdAt),
    description: '',
    sender: '',
  }
}

export const aggregatePaymentHistory = (arg: PaymentHistory[]) =>
  arg.reduce(
    (prev, next) => {
      if (next.type === 'withdrawal') {
        prev.totalWithdrawn.iadd(next.amount)
        return prev
      }
      prev.totalEarned.iadd(next.amount)
      return prev
    },
    {
      totalEarned: new BN(0),
      totalWithdrawn: new BN(0),
    }
  )
