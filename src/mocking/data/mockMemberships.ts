import { BasicMembershipFieldsFragment } from '@/api/queries'

import { regularMockChannels } from './mockChannels'
import { channelAvatarSources } from './mockImages'
import rawMemberships from './raw/memberships.json'

const regularMockMemberships: BasicMembershipFieldsFragment[] = rawMemberships.map((rawMembership, idx) => ({
  ...rawMembership,
  __typename: 'Membership',
  avatarUri: channelAvatarSources[idx % channelAvatarSources.length],
  controllerAccount: 'POLKADOT_ACCOUNT',
  channels: regularMockChannels.splice(0, 3),
}))

export default regularMockMemberships
