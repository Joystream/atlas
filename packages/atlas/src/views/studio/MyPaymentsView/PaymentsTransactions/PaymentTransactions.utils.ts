import BN from 'bn.js'
import { Remote } from 'comlink'

import { GetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'
import { PaymentHistory } from '@/components/TablePaymentsHistory'
import { JoystreamLib } from '@/joystream-lib/lib'

type CommonEvent = Pick<
  GetChannelPaymentEventsQuery['channelRewardClaimedEvents'][number],
  'createdAt' | 'inBlock' | 'amount'
>

export const mapEventToPaymentHistoryFactory =
  (joystream: Remote<JoystreamLib>, address: string) =>
  async <T extends CommonEvent>(event: T, type: PaymentHistory['type']): Promise<PaymentHistory> => {
    const channelBalance = await joystream.getAccountBalanceAtBlock(event.inBlock, address)
    const { inBlock, amount, createdAt } = event
    return {
      type,
      block: inBlock + 1,
      amount: new BN(amount),
      date: new Date(createdAt),
      channelBalance: new BN(channelBalance),
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
