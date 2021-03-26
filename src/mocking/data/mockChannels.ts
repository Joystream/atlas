import { channelAvatarSources, channelPosterSources } from './mockImages'
import rawChannels from './raw/channels.json'
import rawCoverVideo from './raw/coverVideo.json'
import { AllChannelFieldsFragment, AssetAvailability } from '@/api/queries'
import { languages } from '@/config/languages'

export type MockChannel = AllChannelFieldsFragment

export const regularMockChannels: MockChannel[] = rawChannels.map((rawChannel, idx) => ({
  ...rawChannel,
  __typename: 'Channel',
  coverPhoto: {
    __typename: 'AssetUrl',
    url: channelPosterSources[idx % channelPosterSources.length],
  },
  coverPhotoUrl: channelPosterSources[idx % channelPosterSources.length],
  coverPhotoAvailability: AssetAvailability.Accepted,
  avatarPhoto: {
    __typename: 'AssetUrl',
    url: channelAvatarSources[idx % channelAvatarSources.length],
  },
  avatarPhotoUrl: channelAvatarSources[idx % channelAvatarSources.length],
  avatarPhotoAvailability: AssetAvailability.Accepted,
  createdAt: new Date(rawChannel.createdAt),
  isPublic: true,
  isCensored: false,
  language: languages[Math.floor(Math.random() * languages.length)],
}))

export const coverMockChannel: MockChannel = {
  ...rawCoverVideo.channel,
  __typename: 'Channel',
  createdAt: new Date(rawCoverVideo.channel.createdAt),
  avatarPhotoUrl: rawCoverVideo.channel.avatarPhotoUrl,
  coverPhotoAvailability: AssetAvailability.Accepted,
  avatarPhotoAvailability: AssetAvailability.Accepted,
}

const mockChannels: MockChannel[] = [...regularMockChannels, coverMockChannel]

export default mockChannels
