import { CoverVideo, AllChannelFieldsFragment } from '@/api/queries'
import { MockVideo } from '@/mocking/data/mockVideos'

import { mockCoverVideo, mockCoverVideoInfo, mockCoverVideoMedia } from '@/mocking/data/mockCoverVideo'
import { coverMockChannel } from '@/mocking/data/mockChannels'

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
          __typename: 'VideoCategory',
          id: 'random_category',
        },
        duration: mockCoverVideoMedia.duration,
        mediaMetadata: mockCoverVideoMedia,
        channel: coverMockChannel,
      },
    },
  }
}

export default useCoverVideo
