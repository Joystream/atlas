import rawCoverVideo from './raw/coverVideo.json'
import { MockVideo } from '@/mocking/data/mockVideos'
import { MockVideoMedia } from '@/mocking/data/mockVideosMedia'
import { MockChannel } from '@/mocking/data/mockChannels'
import { MockLicense } from '@/mocking/data/mockLicenses'

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
  coverCutLocation: {
    __typename: 'HttpMediaLocation',
    ...rawCoverVideo.videoMedia.coverCutLocation,
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
