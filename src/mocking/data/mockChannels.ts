import { channelAvatarSources, channelPosterSources } from './mockImages'
import rawChannels from './raw/channels.json'
import rawCoverVideo from './raw/coverVideo.json'
import { AllChannelFieldsFragment } from '@/api/queries'
import { languages } from '@/config/languages'

export type MockChannel = AllChannelFieldsFragment

const regularMockChannels: MockChannel[] = rawChannels.map((rawChannel, idx) => ({
  ...rawChannel,
  __typename: 'Channel',
  avatarPhotoUrl: channelAvatarSources[idx % channelAvatarSources.length],
  coverPhotoUrl: channelPosterSources[idx % channelPosterSources.length],
  createdAt: new Date(rawChannel.createdAt),
  isPublic: true,
  language: languages[Math.floor(Math.random() * languages.length)],
}))

export const coverMockChannel: MockChannel = {
  ...rawCoverVideo.channel,
  createdAt: new Date(rawCoverVideo.channel.createdAt),
  isPublic: true,
}

const mockChannels: MockChannel[] = [...regularMockChannels, coverMockChannel]

export default mockChannels
