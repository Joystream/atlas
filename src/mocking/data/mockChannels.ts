import { AllChannelFieldsFragment, AssetAvailability } from '@/api/queries'
import { languages } from '@/config/languages'

import { channelAvatarSources, channelPosterSources } from './mockImages'
import rawChannels from './raw/channels.json'
import rawCoverVideo from './raw/coverVideo.json'

export type MockChannel = AllChannelFieldsFragment

export const regularMockChannels: MockChannel[] = rawChannels.map((rawChannel, idx) => ({
  ...rawChannel,
  __typename: 'Channel',
  coverPhotoUrls: [channelPosterSources[idx % channelPosterSources.length]],
  coverPhotoAvailability: AssetAvailability.Accepted,
  avatarPhotoUrls: [channelAvatarSources[idx % channelAvatarSources.length]],
  avatarPhotoAvailability: AssetAvailability.Accepted,
  createdAt: new Date(rawChannel.createdAt),
  isPublic: Boolean(Math.round(Math.random())),
  isCensored: Boolean(Math.round(Math.random())),
  language: {
    iso: languages[Math.floor(Math.random() * languages.length)].value,
  },
}))

export const coverMockChannel: MockChannel = {
  ...rawCoverVideo.channel,
  __typename: 'Channel',
  createdAt: new Date(rawCoverVideo.channel.createdAt),
  avatarPhotoUrls: [rawCoverVideo.channel.avatarPhotoUrl],
  coverPhotoUrls: [],
  avatarPhotoAvailability: AssetAvailability.Accepted,
  coverPhotoAvailability: AssetAvailability.Invalid,
  isPublic: Boolean(Math.round(Math.random())),
  isCensored: Boolean(Math.round(Math.random())),
}

const mockChannels: MockChannel[] = [...regularMockChannels, coverMockChannel]

export default mockChannels
