import { AssetAvailability, CoverVideo } from '@/api/queries'
import { coverMockChannel } from '@/mocking/data/mockChannels'
import { MockLicense } from '@/mocking/data/mockLicenses'

import mockCategories from './mockCategories'
import rawCoverVideo from './raw/coverVideo.json'

export const mockCoverVideoLicense: MockLicense = {
  __typename: 'License',
  ...rawCoverVideo.license,
}

type MockCoverVideo = CoverVideo & {
  __typename: 'CoverVideo'
}

export const mockCoverVideo: MockCoverVideo = {
  __typename: 'CoverVideo',
  id: 'fake-cover-video-id',
  video: {
    ...rawCoverVideo.video,
    createdAt: new Date(rawCoverVideo.video.createdAt),
    channel: {
      ...coverMockChannel,
      videos: [],
    },
    license: mockCoverVideoLicense,
    mediaMetadata: rawCoverVideo.videoMediaMetadata,
    mediaAvailability: AssetAvailability.Accepted,
    mediaUrls: [rawCoverVideo.cover.coverCutMediaMetadata.location.url],
    thumbnailPhotoUrls: [rawCoverVideo.video.thumbnailPhotoUrl],
    thumbnailPhotoAvailability: AssetAvailability.Accepted,
    duration: rawCoverVideo.videoMediaMetadata.duration,
    category: mockCategories[mockCategories.length - 1],
    isCensored: false,
    isFeatured: false,
  },
  coverCutMediaMetadata: {
    __typename: 'VideoMediaMetadata',
    ...rawCoverVideo.cover.coverCutMediaMetadata,
  },
  coverCutMediaAvailability: AssetAvailability.Accepted,
  coverDescription: rawCoverVideo.cover.coverDescription,
}
