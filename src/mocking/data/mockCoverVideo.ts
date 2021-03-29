import rawCoverVideo from './raw/coverVideo.json'
import mockCategories from './mockCategories'
import { MockVideo } from '@/mocking/data/mockVideos'
import { MockVideoMedia } from '@/mocking/data/mockVideosMedia'
import { coverMockChannel } from '@/mocking/data/mockChannels'
import { MockLicense } from '@/mocking/data/mockLicenses'
import { AssetAvailability, CoverVideo } from '@/api/queries'

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
  channel: coverMockChannel,
  license: mockCoverVideoLicense,
  mediaMetadata: mockCoverVideoMedia,
  mediaAvailability: AssetAvailability.Accepted,
  mediaUrl: rawCoverVideo.cover.coverCutMediaUrl,
  thumbnailUrl: rawCoverVideo.video.thumbnailUrl,
  thumbnailAvailability: AssetAvailability.Accepted,
  duration: rawCoverVideo.videoMedia.duration,
  category: mockCategories[mockCategories.length - 1],
}

export type CoverInfo = Omit<CoverVideo, 'video' | '__typename' | 'id'>

export const mockCoverVideoInfo: CoverInfo = {
  ...rawCoverVideo.cover,
  coverCutMediaMetadata: {
    __typename: 'VideoMediaMetadata',
    ...rawCoverVideo.cover.coverCutMediaMetadata,
  },
  coverCutmediaAvailability: AssetAvailability.Accepted,
}
