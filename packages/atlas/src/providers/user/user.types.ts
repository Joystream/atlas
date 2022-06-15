import { Wallet, WalletAccount } from '@talisman-connect/wallets'

import { useMemberships } from '@/api/hooks'
import { AllMembershipFieldsFragment } from '@/api/queries'

export type Membership = AllMembershipFieldsFragment
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
  activeMembership: Membership | null

  isAuthLoading: boolean

  signIn: () => Promise<void>
  refetchUserMemberships: ReturnType<typeof useMemberships>['refetch']
}
