import {
  useGetVideoQuery,
  useAddVideoViewMutation,
  GetVideoQuery,
  AddVideoViewMutation,
} from '@/api/queries/__generated__/videos.generated'
import { QueryHookOptions, MutationHookOptions } from '@apollo/client'

type Opts = QueryHookOptions<GetVideoQuery>
const useVideo = (id: string, opts?: Opts) => {
  const { data, ...queryRest } = useGetVideoQuery({
    ...opts,
    variables: { id },
  })

  return {
    video: data?.video,
    ...queryRest,
  }
}

type AddVideoViewOpts = MutationHookOptions<AddVideoViewMutation>
export const useAddVideoView = (opts?: AddVideoViewOpts) => {
  const [addVideoView, rest] = useAddVideoViewMutation()
  return {
    addVideoView: (videoId: string, channelId: string) =>
      addVideoView({
        ...opts,
        variables: {
          videoId,
          channelId,
        },
        update: (cache, mutationResult) => {
          cache.modify({
            id: cache.identify({
              __typename: 'Video',
              id: videoId,
            }),
            fields: {
              views: () => mutationResult.data?.addVideoView.views,
            },
          })
        },
      }),
    ...rest,
  }
}

export default useVideo
