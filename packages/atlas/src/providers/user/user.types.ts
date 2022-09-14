import { Wallet, WalletAccount } from '@talisman-connect/wallets'

import { useMemberships } from '@/api/hooks/membership'
import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

export type Membership = FullMembershipFieldsFragment
export type ActiveUserState = {
  accountId: string | null
  memberId: string | null
  channelId: string | null
}

export type SignerWallet = Wallet
export type SignerWalletStatus = 'unknown' | 'connected' | 'disconnected' | 'pending'
export type SignerWalletAccount = WalletAccount
export type UserContextValue = {
  memberships: Membership[]
  membershipsLoading: boolean
  activeMembership: Membership | null

  isAuthLoading: boolean

  signIn: (walletName?: string) => Promise<boolean>
  refetchUserMemberships: ReturnType<typeof useMemberships>['refetch']
}
