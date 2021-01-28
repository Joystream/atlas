import { GetCoverVideo_coverVideo } from '@/api/queries/__generated__/GetCoverVideo'
import {
  mockCoverVideo,
  mockCoverVideoChannel,
  mockCoverVideoInfo,
  mockCoverVideoLicense,
  mockCoverVideoMedia,
} from '@/mocking/data/mockCoverVideo'

type UseCoverVideo = () => { data: GetCoverVideo_coverVideo }

const useCoverVideo: UseCoverVideo = () => {
  return {
    data: {
      __typename: 'CoverVideo',
      coverDescription: mockCoverVideoInfo.coverDescription,
      coverCutMedia: mockCoverVideoInfo.coverCutMedia,
      video: {
        ...mockCoverVideo,
        createdAt: new Date(),
        category: {
          __typename: 'Category',
          id: 'random_category',
        },
        duration: mockCoverVideoMedia.duration,
        media: mockCoverVideoMedia,
        channel: mockCoverVideoChannel,
        license: mockCoverVideoLicense,
      },
    },
  }
}

export default useCoverVideo
