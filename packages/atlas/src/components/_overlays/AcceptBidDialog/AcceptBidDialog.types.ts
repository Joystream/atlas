import { BasicMembershipFieldsFragment } from '@/api/queries'

export type Bid = {
  createdAt: Date
  amount: number
  amountUSD: number | null
  bidder: BasicMembershipFieldsFragment
}
