import BN from 'bn.js'

import { PaymentHistory } from '@/components/TablePaymentsHistory'

//! WARNING todo needs to be rewritten with orion v2
// type CommonEvent = Pick<'createdAt' | 'inBlock' | 'amount'> & {
//   sender: 'council' | string
//   description?: string
// }

// export const mapEventToPaymentHistory = <T extends CommonEvent>(
//   event: T,
//   type: PaymentHistory['type']
// ): PaymentHistory => {
//   const { inBlock, amount, createdAt } = event
//   return {
//     type,
//     block: inBlock + 1,
//     amount: new BN(amount),
//     date: new Date(createdAt),
//     description: event.description,
//     sender: event.sender,
//   }
// }

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
