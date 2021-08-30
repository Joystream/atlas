import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  AddVideoViewMutation,
  GetBasicVideosQuery,
  GetBasicVideosQueryVariables,
  GetChannelVideosPreviewQuery,
  GetMostViewedVideosAllTimeQuery,
  GetMostViewedVideosAllTimeQueryVariables,
  GetMostViewedVideosQuery,
  GetMostViewedVideosQueryVariables,
  GetVideoQuery,
  GetVideosQuery,
  GetVideosQueryVariables,
  useAddVideoViewMutation,
  useGetBasicVideosQuery,
  useGetChannelVideosPreviewQuery,
  useGetMostViewedVideosAllTimeQuery,
  useGetMostViewedVideosQuery,
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

export const useChannelPreviewVideos = (
  channelId: string | null | undefined,
  opts?: QueryHookOptions<GetChannelVideosPreviewQuery>
) => {
  const { data, ...rest } = useGetChannelVideosPreviewQuery({
    ...opts,
    variables: { channelId },
    skip: !channelId || opts?.skip,
  })
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

type MostViewedVideosOpts = QueryHookOptions<GetMostViewedVideosQuery>
export const useMostViewedVideosIds = (variables?: GetMostViewedVideosQueryVariables, opts?: MostViewedVideosOpts) => {
  const { data, ...rest } = useGetMostViewedVideosQuery({ ...opts, variables })
  return {
    mostViewedVideos: data?.mostViewedVideos,
    ...rest,
  }
}

export const useMostViewedVideos = (variables?: GetMostViewedVideosQueryVariables, opts?: MostViewedVideosOpts) => {
  const { mostViewedVideos, loading, error } = useMostViewedVideosIds(variables, opts)

  const mostViewedVideosIds = mostViewedVideos?.map((item) => item.id)

  const { videos, ...rest } = useVideos(
    {
      where: {
        id_in: mostViewedVideosIds,
      },
    },
    { skip: !mostViewedVideosIds }
  )

  const sortedVideos = videos
    ? videos.map((video) => ({ ...video, views: video.views || 0 })).sort((a, b) => b.views - a.views)
    : null

  return {
    videos: sortedVideos,
    ...rest,
    error: error || rest.error,
    loading: loading || rest.loading,
  }
}

type MostViewedVideosAllTimeOpts = QueryHookOptions<GetMostViewedVideosAllTimeQuery>
export const useMostViewedVideosAllTimeIds = (
  variables?: GetMostViewedVideosAllTimeQueryVariables,
  opts?: MostViewedVideosAllTimeOpts
) => {
  const { data, ...rest } = useGetMostViewedVideosAllTimeQuery({ ...opts, variables })
  return {
    mostViewedVideosAllTime: data?.mostViewedVideosAllTime,
    ...rest,
  }
}
