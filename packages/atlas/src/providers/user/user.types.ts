import { useMemberships } from '@/api/hooks/membership'
import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

export type Membership = FullMembershipFieldsFragment

export type UserContextValue = {
  memberships: Membership[]
  membershipsLoading: boolean
  activeMembership: Membership | null
  activeChannel: Membership['channels'][number] | null
  memberChannels: Membership['channels'] | null
  setActiveChannel: (channelId: string) => void
  refetchUserMemberships: ReturnType<typeof useMemberships>['refetch']
  memberId: string | null
  accountId: string | null
  channelId: string | null
}
