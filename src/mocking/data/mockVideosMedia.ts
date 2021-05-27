import rawVideosMedia from './raw/videosMedia.json'

export type MockVideoMedia = {
  id: string
  duration: number
  location: {
    url: string
  }
}

const mockVideosMedia: MockVideoMedia[] = rawVideosMedia.map((rawVideoMedia) => {
  return {
    ...rawVideoMedia,
    __typename: 'VideoMediaMetadata',
  }
})

export default mockVideosMedia
