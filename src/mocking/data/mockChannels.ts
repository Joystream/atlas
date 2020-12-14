import { channelAvatarSources, channelPosterSources } from './mockImages'
import { AllChannelFields } from '@/api/queries/__generated__/AllChannelFields'
import rawChannels from './raw/channels.json'

export type MockChannel = AllChannelFields

const mockChannels: MockChannel[] = rawChannels.map((rawChannel, idx) => ({
  ...rawChannel,
  __typename: 'Channel',
  avatarPhotoUrl: channelAvatarSources[idx % channelAvatarSources.length],
  coverPhotoUrl: channelPosterSources[idx % channelPosterSources.length],
}))

export default mockChannels
