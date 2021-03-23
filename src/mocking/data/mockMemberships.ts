import { channelAvatarSources } from './mockImages'
import rawMemberships from './raw/memberships.json'
import { BasicMembershipFieldsFragment } from '@/api/queries'

const regularMockMemberships: BasicMembershipFieldsFragment[] = rawMemberships.map((rawMembership, idx) => ({
  ...rawMembership,
  __typename: 'Membership',
  avatarUri: channelAvatarSources[idx % channelAvatarSources.length],
  controllerAccount: `POLKADOT_ACCOUNT_${idx}`,
}))

export default regularMockMemberships
