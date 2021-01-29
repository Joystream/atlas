import { channelAvatarSources, channelPosterSources } from './mockImages'
import rawChannels from './raw/channels.json'
import { AllChannelFieldsFragment } from '@/api/queries/__generated__/channels.generated'

export type MockChannel = AllChannelFieldsFragment

const mockChannels: MockChannel[] = rawChannels.map((rawChannel, idx) => ({
  ...rawChannel,
  __typename: 'Channel',
  avatarPhotoUrl: channelAvatarSources[idx % channelAvatarSources.length],
  coverPhotoUrl: channelPosterSources[idx % channelPosterSources.length],
}))

export default mockChannels
