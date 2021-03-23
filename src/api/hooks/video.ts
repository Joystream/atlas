import {
  useGetVideoQuery,
  useAddVideoViewMutation,
  GetVideoQuery,
  AddVideoViewMutation,
  GetVideosQuery,
  GetVideosQueryVariables,
  useGetVideosQuery,
  useGetVideoCountQuery,
} from '@/api/queries'
import { QueryHookOptions, MutationHookOptions } from '@apollo/client'

type VideoOpts = QueryHookOptions<GetVideoQuery>
export const useVideo = (id: string, opts?: VideoOpts) => {
  const { data, ...queryRest } = useGetVideoQuery({
    ...opts,
    variables: { where: { id } },
  })

  return {
    video: data?.video,
    ...queryRest,
  }
}

type VideosOpts = QueryHookOptions<GetVideosQuery>
export const useVideos = (variables?: GetVideosQueryVariables, opts?: VideosOpts) => {
  const { data, loading: videosLoading, ...rest } = useGetVideosQuery({ ...opts, variables })
  // Only way to get the video count for pagination as of now
  const { data: connectionData, loading: countLoading } = useGetVideoCountQuery({ ...opts, variables })
  return {
    videos: data?.videos,
    loading: videosLoading || countLoading,
    totalCount: connectionData?.videosConnection.totalCount,
    ...rest,
  }
}

type AddVideoViewOpts = Omit<MutationHookOptions<AddVideoViewMutation>, 'variables'>
export const useAddVideoView = (opts?: AddVideoViewOpts) => {
  const [addVideoView, rest] = useAddVideoViewMutation({
    update: (cache, mutationResult) => {
      cache.modify({
        id: cache.identify({
          __typename: 'Video',
          id: mutationResult.data?.addVideoView.id,
        }),
        fields: {
          views: () => mutationResult.data?.addVideoView.views,
        },
      })
    },
    ...opts,
  })
  return {
    addVideoView,
    ...rest,
  }
}
