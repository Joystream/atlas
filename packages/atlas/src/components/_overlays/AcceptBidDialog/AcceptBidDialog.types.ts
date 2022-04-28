import { BasicMembershipFieldsFragment } from '@/api/queries'

export type Bid = {
  createdAt: Date
  amount: string
  amountUSD: string | null
  bidder: BasicMembershipFieldsFragment
}
