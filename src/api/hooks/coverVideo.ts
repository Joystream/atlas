import { CoverVideo, AllChannelFieldsFragment } from '@/api/queries'
import { MockVideo } from '@/mocking/data/mockVideos'

import { mockCoverVideo } from '@/mocking/data/mockCoverVideo'

type UseCoverVideo = () => {
  data: {
    __typename: 'CoverVideo'
    coverDescription: CoverVideo['coverDescription']
    coverCutMediaMetadata: CoverVideo['coverCutMediaMetadata']
    video: MockVideo & { channel: AllChannelFieldsFragment }
  }
}

const useCoverVideo: UseCoverVideo = () => {
  return {
    data: mockCoverVideo,
  }
}

export default useCoverVideo
