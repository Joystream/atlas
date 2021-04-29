import { channelAvatarSources } from './mockImages'
import rawMemberships from './raw/memberships.json'
import { regularMockChannels } from './mockChannels'
import { BasicMembershipFieldsFragment } from '@/api/queries'

const regularMockMemberships: BasicMembershipFieldsFragment[] = rawMemberships.map((rawMembership, idx) => ({
  ...rawMembership,
  __typename: 'Membership',
  avatarUri: channelAvatarSources[idx % channelAvatarSources.length],
  controllerAccount: 'POLKADOT_ACCOUNT',
  channels: regularMockChannels.splice(0, 3),
}))

export default regularMockMemberships
