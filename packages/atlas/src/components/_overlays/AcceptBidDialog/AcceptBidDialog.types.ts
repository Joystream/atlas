import { BasicMembershipFieldsFragment } from '@/api/queries'

export type Bid = {
  id: string
  createdAt: Date
  amount: string
  amountUSD: string
  bidder: BasicMembershipFieldsFragment
}
