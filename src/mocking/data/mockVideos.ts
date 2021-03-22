import { thumbnailSources } from './mockImages'
import rawVideos from './raw/videos.json'
import rawCoverVideo from './raw/coverVideo.json'
import { VideoFieldsFragment } from '@/api/queries'
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
    thumbnailUrl: thumbnailSources[idx % thumbnailSources.length],
    duration: mockVideosMedia[mediaIndex].duration,
    mediaMetadata: mockVideosMedia[mediaIndex],
    media: {
      __typename: 'AssetUrl',
      // @ts-ignore unable to generate new videosMedia.json
      url: mockVideosMedia[mediaIndex].location.url,
    },
    thumbnail: {
      __typename: 'AssetUrl',
      url: thumbnailSources[idx % thumbnailSources.length],
    },
    channel: mockChannels[idx % mockChannels.length],
    category: mockCategories[idx % mockCategories.length],
    license: mockLicenses[idx % mockLicenses.length],
    isPublic: Boolean(Math.round(Math.random())),
  } as MockVideo
})

const coverMockVideo: MockVideo = {
  ...rawCoverVideo.video,
  createdAt: new Date(rawCoverVideo.video.createdAt),
  channel: coverMockChannel,
  license: rawCoverVideo.license,
  media: {
    __typename: 'AssetUrl',
    url: rawCoverVideo.video.media.url,
  },
  thumbnail: {
    __typename: 'AssetUrl',
    url: rawCoverVideo.video.thumbnail.url,
  },
  mediaMetadata: rawCoverVideo.videoMedia,
  duration: rawCoverVideo.videoMedia.duration,
  category: mockCategories[0],
  isPublic: true,
}

const mockVideos: MockVideo[] = [...regularMockVideos, coverMockVideo]

export default mockVideos
