import { thumbnailSources } from './mockImages'
import rawVideos from './raw/videos.json'
import { VideoFieldsFragment } from '@/api/queries'

export type MockVideo = Omit<
  VideoFieldsFragment,
  'media' | 'category' | 'channel' | 'createdAt' | 'duration' | 'license' | 'isPublic' | 'isCurated' | 'isExplicit'
> & {
  createdAt: unknown
}

const mockVideos: MockVideo[] = rawVideos.map((rawVideo, idx) => {
  return {
    ...rawVideo,
    __typename: 'Video',
    thumbnailUrl: thumbnailSources[idx % thumbnailSources.length],
  }
})

export default mockVideos
