import { channelAvatarSources } from './mockImages'
import rawMemberships from './raw/memberships.json'
import { regularMockChannels } from './mockChannels'
import { BasicMembershipFieldsFragment } from '@/api/queries'

const regularMockMemberships: BasicMembershipFieldsFragment[] = rawMemberships.map((rawMembership, idx) => ({
  ...rawMembership,
  __typename: 'Membership',
  avatarUri: channelAvatarSources[idx % channelAvatarSources.length],
  // TODO: change back
  controllerAccount: '5HYySFRdS6993Fxsv5tPR3Vu5Cj5db4YghNJfYG14NR4CprA',
  channels: regularMockChannels.splice(0, 3),
}))

export default regularMockMemberships
