import { CoverVideo, AllChannelFieldsFragment } from '@/api/queries'
import { MockVideo } from '@/mocking/data/mockVideos'

import {
  mockCoverVideo,
  mockCoverVideoChannel,
  mockCoverVideoInfo,
  mockCoverVideoMedia,
} from '@/mocking/data/mockCoverVideo'

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
    data: {
      __typename: 'CoverVideo',
      coverDescription: mockCoverVideoInfo.coverDescription,
      coverCutMediaMetadata: mockCoverVideoInfo.coverCutMediaMetadata,
      video: {
        ...mockCoverVideo,
        createdAt: new Date(),
        category: {
          __typename: 'Category',
          id: 'random_category',
        },
        duration: mockCoverVideoMedia.duration,
        mediaMetadata: mockCoverVideoMedia,
        channel: mockCoverVideoChannel,
      },
    },
  }
}

export default useCoverVideo
