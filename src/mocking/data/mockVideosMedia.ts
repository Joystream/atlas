import rawVideosMedia from './raw/videosMedia.json'
import { VideoMediaFieldsFragment } from '@/api/queries'

export type MockVideoMedia = VideoMediaFieldsFragment & {
  duration: number
}

const mockVideosMedia: MockVideoMedia[] = rawVideosMedia.map((rawVideoMedia) => {
  return {
    ...rawVideoMedia,
    __typename: 'VideoMediaMetadata',
  }
})

export default mockVideosMedia
