import { AllChannelFieldsFragment, AssetAvailability } from '@/api/queries'
import { languages } from '@/config/languages'

import { channelAvatarSources, channelPosterSources } from './mockImages'
import rawVideoHero from './raw/VideoHero.json'
import rawChannels from './raw/channels.json'

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
  ...rawVideoHero.channel,
  __typename: 'Channel',
  createdAt: new Date(rawVideoHero.channel.createdAt),
  avatarPhotoUrls: [rawVideoHero.channel.avatarPhotoUrl],
  coverPhotoUrls: [],
  avatarPhotoAvailability: AssetAvailability.Accepted,
  coverPhotoAvailability: AssetAvailability.Invalid,
  isPublic: Boolean(Math.round(Math.random())),
  isCensored: Boolean(Math.round(Math.random())),
}

const mockChannels: MockChannel[] = [...regularMockChannels, coverMockChannel]

export default mockChannels
