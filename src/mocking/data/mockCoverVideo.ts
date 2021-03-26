import rawCoverVideo from './raw/coverVideo.json'
import mockCategories from './mockCategories'
import { MockVideo } from '@/mocking/data/mockVideos'
import { MockVideoMedia } from '@/mocking/data/mockVideosMedia'
import { MockChannel } from '@/mocking/data/mockChannels'
import { MockLicense } from '@/mocking/data/mockLicenses'
import { AssetAvailability, CoverVideo } from '@/api/queries'

export const mockCoverVideoChannel: MockChannel = {
  ...rawCoverVideo.channel,
  createdAt: new Date(rawCoverVideo.channel.createdAt),
  coverPhotoAvailability: AssetAvailability.Accepted,
  avatarPhotoUrl: rawCoverVideo.channel.avatarPhotoUrl,
  avatarPhotoAvailability: AssetAvailability.Accepted,
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
  mediaAvailability: AssetAvailability.Accepted,
  mediaUrl: rawCoverVideo.cover.coverCutMediaUrl,
  thumbnailUrl: rawCoverVideo.video.thumbnailUrl,
  thumbnailAvailability: AssetAvailability.Accepted,
  duration: rawCoverVideo.videoMedia.duration,
  category: mockCategories[mockCategories.length],
  isPublic: true,
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
