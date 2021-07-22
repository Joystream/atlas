import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  AddVideoViewMutation,
  GetBasicVideosQuery,
  GetBasicVideosQueryVariables,
  GetVideoQuery,
  GetVideosQuery,
  GetVideosQueryVariables,
  useAddVideoViewMutation,
  useGetBasicVideosQuery,
  useGetVideoQuery,
  useGetVideosQuery,
} from '@/api/queries'

type VideoOpts = QueryHookOptions<GetVideoQuery>
export const useVideo = (id: string, opts?: VideoOpts) => {
  const { data, ...queryRest } = useGetVideoQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    video: data?.videoByUniqueInput,
    ...queryRest,
  }
}

type VideosOpts = QueryHookOptions<GetVideosQuery>
export const useVideos = (variables?: GetVideosQueryVariables, opts?: VideosOpts) => {
  const { data, ...rest } = useGetVideosQuery({ ...opts, variables })
  return {
    videos: data?.videos,
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

type BasicVideosQueryOpts = QueryHookOptions<GetBasicVideosQuery>
export const useBasicVideos = (variables?: GetBasicVideosQueryVariables, opts?: BasicVideosQueryOpts) => {
  const { data, ...rest } = useGetBasicVideosQuery({ ...opts, variables })
  return {
    videos: data?.videos,
    ...rest,
  }
}
