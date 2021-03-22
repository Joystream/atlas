import rawCoverVideo from './raw/coverVideo.json'
import mockCategories from './mockCategories'
import { MockVideo } from '@/mocking/data/mockVideos'
import { MockVideoMedia } from '@/mocking/data/mockVideosMedia'
import { MockChannel } from '@/mocking/data/mockChannels'
import { MockLicense } from '@/mocking/data/mockLicenses'
import { CoverVideo } from '@/api/queries'

export const mockCoverVideoChannel: MockChannel = {
  ...rawCoverVideo.channel,
  createdAt: new Date(rawCoverVideo.channel.createdAt),
  avatarPhoto: {
    __typename: 'AssetUrl',
    url: rawCoverVideo.channel.avatarPhoto.url,
  },
  __typename: 'Channel',
}

export const mockCoverVideoLicense: MockLicense = {
  __typename: 'License',
  ...rawCoverVideo.license,
}
export const mockCoverVideoMedia: MockVideoMedia = {
  ...rawCoverVideo.videoMedia,
  __typename: 'VideoMediaMetadata',
}

export const mockCoverVideo: MockVideo = {
  ...rawCoverVideo.video,
  __typename: 'Video',
  createdAt: new Date(rawCoverVideo.video.createdAt),
  channel: mockCoverVideoChannel,
  license: mockCoverVideoLicense,
  mediaMetadata: mockCoverVideoMedia,
  media: {
    __typename: 'AssetUrl',
    url: rawCoverVideo.cover.coverCutMedia.url,
  },
  thumbnail: {
    __typename: 'AssetUrl',
    url: rawCoverVideo.video.thumbnail.url,
  },
  duration: rawCoverVideo.videoMedia.duration,
  category: mockCategories[mockCategories.length],
}

export type CoverInfo = Omit<CoverVideo, 'video' | '__typename' | 'id'>

export const mockCoverVideoInfo: CoverInfo = {
  ...rawCoverVideo.cover,
  coverCutMediaMetadata: {
    __typename: 'VideoMediaMetadata',
    ...rawCoverVideo.cover.coverCutMediaMetadata,
  },
}
