import BN from 'bn.js'

import { BasicMembershipFieldsFragment } from '@/api/queries'

export type Bid = {
  id: string
  createdAt: Date
  amount: BN
  amountUSD: number | null
  bidder: BasicMembershipFieldsFragment
}

export type SelectedBid = {
  bidderId: string
  amount: BN
}
