import rawCoverVideo from './raw/coverVideo.json'
import { MockVideo } from '@/mocking/data/mockVideos'
import { MockVideoMedia } from '@/mocking/data/mockVideosMedia'
import { MockChannel } from '@/mocking/data/mockChannels'
import { MockLicense } from '@/mocking/data/mockLicenses'
import { CoverVideo } from '@/api/queries'

export const mockCoverVideoChannel: MockChannel = {
  ...rawCoverVideo.channel,
  __typename: 'Channel',
}

export const mockCoverVideo: MockVideo = {
  ...rawCoverVideo.video,
  __typename: 'Video',
}

export const mockCoverVideoMedia: MockVideoMedia = {
  ...rawCoverVideo.videoMedia,
  __typename: 'VideoMedia',
  location: {
    __typename: 'HttpMediaLocation',
    ...rawCoverVideo.videoMedia.location,
  },
}

export type CoverInfo = Omit<CoverVideo, 'video' | '__typename' | 'id'>

export const mockCoverVideoInfo: CoverInfo = {
  ...rawCoverVideo.cover,
  coverCutMedia: {
    __typename: 'VideoMedia',
    ...rawCoverVideo.cover.coverCutMedia,
    location: {
      __typename: 'HttpMediaLocation',
      ...rawCoverVideo.cover.coverCutMedia.location,
    },
  },
}

export const mockCoverVideoLicense: MockLicense = {
  __typename: 'LicenseEntity',
  ...rawCoverVideo.license,
  type: {
    ...rawCoverVideo.license.type,
    __typename: 'UserDefinedLicense',
  },
}
