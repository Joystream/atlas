import { thumbnailSources } from './mockImages'
import rawVideos from './raw/videos.json'
import rawCoverVideo from './raw/coverVideo.json'
import { AssetAvailability, VideoFieldsFragment } from '@/api/queries'
import mockVideosMedia from './mockVideosMedia'
import mockChannels, { coverMockChannel } from './mockChannels'
import mockCategories from './mockCategories'
import mockLicenses from './mockLicenses'

export type MockVideo = VideoFieldsFragment

const regularMockVideos: MockVideo[] = rawVideos.map((rawVideo, idx) => {
  const mediaIndex = idx % mockVideosMedia.length

  return {
    ...rawVideo,
    __typename: 'Video',
    createdAt: new Date(rawVideo.createdAt),
    duration: mockVideosMedia[mediaIndex].duration,
    mediaMetadata: mockVideosMedia[mediaIndex],
    mediaUrls: [mockVideosMedia[mediaIndex].location.url],
    mediaAvailability: AssetAvailability.Accepted,
    thumbnailPhotoUrls: [thumbnailSources[idx % thumbnailSources.length]],
    thumbnailPhotoAvailability: AssetAvailability.Accepted,
    channel: mockChannels[idx % mockChannels.length],
    category: mockCategories[idx % mockCategories.length],
    license: mockLicenses[idx % mockLicenses.length],
    isPublic: Boolean(Math.round(Math.random())),
    isCensored: Boolean(Math.round(Math.random())),
    isFeatured: Boolean(Math.round(Math.random())),
  } as MockVideo
})

const coverMockVideo: MockVideo = {
  ...rawCoverVideo.video,
  createdAt: new Date(rawCoverVideo.video.createdAt),
  channel: coverMockChannel,
  license: rawCoverVideo.license,
  mediaAvailability: AssetAvailability.Accepted,
  mediaUrls: [rawCoverVideo.video.mediaUrl],
  thumbnailPhotoUrls: [rawCoverVideo.video.thumbnailPhotoUrl],
  thumbnailPhotoAvailability: AssetAvailability.Accepted,
  mediaMetadata: rawCoverVideo.videoMediaMetadata,
  duration: rawCoverVideo.videoMediaMetadata.duration,
  category: mockCategories[0],
  isPublic: Boolean(Math.round(Math.random())),
  isCensored: Boolean(Math.round(Math.random())),
  isFeatured: Boolean(Math.round(Math.random())),
}

const mockVideos: MockVideo[] = [...regularMockVideos, coverMockVideo]

export default mockVideos
