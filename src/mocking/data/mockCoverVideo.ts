import rawCoverVideo from './raw/coverVideo.json'
import mockCategories from './mockCategories'
import { MockVideo } from '@/mocking/data/mockVideos'
import { coverMockChannel } from '@/mocking/data/mockChannels'
import { MockLicense } from '@/mocking/data/mockLicenses'
import { AssetAvailability, CoverVideo } from '@/api/queries'
import { MockVideoMedia } from './mockVideosMedia'

export const mockCoverVideoLicense: MockLicense = {
  __typename: 'License',
  ...rawCoverVideo.license,
}
export const mockCoverVideoMedia: Omit<MockVideoMedia, 'location'> = {
  ...rawCoverVideo.videoMedia,
}

export const mockCoverVideo: MockVideo = {
  ...rawCoverVideo.video,
  __typename: 'Video',
  createdAt: new Date(rawCoverVideo.video.createdAt),
  channel: coverMockChannel,
  license: mockCoverVideoLicense,
  mediaMetadata: mockCoverVideoMedia,
  mediaAvailability: AssetAvailability.Accepted,
  mediaUrl: rawCoverVideo.cover.coverCutMediaMetadata.location.url,
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
  coverCutMediaAvailability: AssetAvailability.Accepted,
}
