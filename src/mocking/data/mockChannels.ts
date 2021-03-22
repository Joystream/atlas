import { channelAvatarSources, channelPosterSources } from './mockImages'
import rawChannels from './raw/channels.json'
import rawCoverVideo from './raw/coverVideo.json'
import { AllChannelFieldsFragment } from '@/api/queries'
import { languages } from '@/config/languages'

export type MockChannel = AllChannelFieldsFragment

export const regularMockChannels: MockChannel[] = rawChannels.map((rawChannel, idx) => ({
  ...rawChannel,
  __typename: 'Channel',
  coverPhoto: {
    __typename: 'AssetUrl',
    url: channelPosterSources[idx % channelPosterSources.length],
  },
  avatarPhoto: {
    __typename: 'AssetUrl',
    url: channelPosterSources[idx % channelAvatarSources.length],
  },
  createdAt: new Date(rawChannel.createdAt),
  isPublic: true,
  isCensored: false,
  language: languages[Math.floor(Math.random() * languages.length)],
}))

export const coverMockChannel: MockChannel = {
  ...rawCoverVideo.channel,
  __typename: 'Channel',
  avatarPhoto: {
    ...rawCoverVideo.channel.avatarPhoto,
    __typename: 'AssetUrl',
  },
  createdAt: new Date(rawCoverVideo.channel.createdAt),
}

const mockChannels: MockChannel[] = [...regularMockChannels, coverMockChannel]

export default mockChannels
