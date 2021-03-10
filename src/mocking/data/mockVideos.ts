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
    media: mockVideosMedia[mediaIndex],
    channel: mockChannels[idx % mockChannels.length],
    category: mockCategories[idx % mockCategories.length],
    license: mockLicenses[idx % mockLicenses.length],
  } as MockVideo
})

const coverMockVideo: MockVideo = {
  ...rawCoverVideo.video,
  createdAt: new Date(rawCoverVideo.video.createdAt),
  channel: coverMockChannel,
  // @ts-ignore __typename not matching, whatever
  license: rawCoverVideo.license,
  // @ts-ignore __typename not matching, whatever
  media: rawCoverVideo.videoMedia,
  duration: rawCoverVideo.videoMedia.duration,
  category: mockCategories[0],
}

const mockVideos: MockVideo[] = [...regularMockVideos, coverMockVideo]

export default mockVideos
