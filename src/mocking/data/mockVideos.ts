import { AssetAvailability, VideoFieldsFragment } from '@/api/queries'

import mockCategories from './mockCategories'
import mockChannels, { coverMockChannel } from './mockChannels'
import { thumbnailSources } from './mockImages'
import mockLicenses from './mockLicenses'
import mockVideosMedia from './mockVideosMedia'
import rawVideoHero from './raw/VideoHero.json'
import rawVideos from './raw/videos.json'

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
  ...rawVideoHero.video,
  createdAt: new Date(rawVideoHero.video.createdAt),
  channel: coverMockChannel,
  license: rawVideoHero.license,
  mediaAvailability: AssetAvailability.Accepted,
  mediaUrls: [rawVideoHero.video.mediaUrl],
  thumbnailPhotoUrls: [rawVideoHero.video.thumbnailPhotoUrl],
  thumbnailPhotoAvailability: AssetAvailability.Accepted,
  mediaMetadata: rawVideoHero.mediaMetadata,
  duration: rawVideoHero.mediaMetadata.duration,
  category: mockCategories[0],
  isPublic: Boolean(Math.round(Math.random())),
  isCensored: Boolean(Math.round(Math.random())),
  isFeatured: Boolean(Math.round(Math.random())),
}

const mockVideos: MockVideo[] = [...regularMockVideos, coverMockVideo]

export default mockVideos
