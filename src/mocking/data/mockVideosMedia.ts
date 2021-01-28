import rawVideosMedia from './raw/videosMedia.json'
import { VideoMediaFieldsFragment } from '@/api/queries/__generated__/videos.generated'

export type MockVideoMedia = VideoMediaFieldsFragment & {
  duration: number
  coverCutLocation?: VideoMediaFieldsFragment['location']
}

const mockVideosMedia: MockVideoMedia[] = rawVideosMedia.map((rawVideoMedia) => {
  return {
    ...rawVideoMedia,
    __typename: 'VideoMedia',
    location: {
      __typename: 'HttpMediaLocation',
      ...rawVideoMedia.location,
    },
  }
})

export default mockVideosMedia
