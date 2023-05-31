import { useMemberships } from '@/api/hooks/membership'
import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

export type Membership = FullMembershipFieldsFragment
export type ActiveUserState = {
  accountId: string | null
  memberId: string | null
  channelId: string | null
  loggedInAccountId: string | null
}

export type UserContextValue = {
  memberships: Membership[]
  membershipsLoading: boolean
  activeMembership: Membership | null
  activeChannel: Membership['channels'][number] | null
  refetchUserMemberships: ReturnType<typeof useMemberships>['refetch']
}
