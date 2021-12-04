import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  AddVideoViewMutation,
  GetBasicVideosQuery,
  GetBasicVideosQueryVariables,
  GetMostViewedVideosAllTimeQuery,
  GetMostViewedVideosAllTimeQueryVariables,
  GetMostViewedVideosQuery,
  GetMostViewedVideosQueryVariables,
  GetVideoCountQuery,
  GetVideoCountQueryVariables,
  GetVideoQuery,
  GetVideoQueryVariables,
  GetVideosQuery,
  GetVideosQueryVariables,
  VideoOrderByInput,
  useAddVideoViewMutation,
  useGetBasicVideosQuery,
  useGetMostViewedVideosAllTimeQuery,
  useGetMostViewedVideosQuery,
  useGetVideoCountQuery,
  useGetVideoQuery,
  useGetVideosQuery,
} from '@/api/queries'

export const useVideo = (id: string, opts?: QueryHookOptions<GetVideoQuery, GetVideoQueryVariables>) => {
  const { data, ...queryRest } = useGetVideoQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    video: data?.videoByUniqueInput,
    ...queryRest,
  }
}

export const useVideos = (
  variables?: GetVideosQueryVariables,
  opts?: QueryHookOptions<GetVideosQuery, GetVideosQueryVariables>
) => {
  const { data, ...rest } = useGetVideosQuery({ ...opts, variables })
  return {
    videos: data?.videos,
    ...rest,
  }
}

export const useChannelPreviewVideos = (
  channelId: string | null | undefined,
  opts?: QueryHookOptions<GetVideosQuery>
) => {
  const { data, ...rest } = useGetVideosQuery({
    ...opts,
    variables: {
      where: {
        channel: {
          id_eq: channelId,
        },
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
      },
      orderBy: VideoOrderByInput.CreatedAtDesc,
      offset: 0,
      limit: 10,
    },
    skip: !channelId || opts?.skip,
  })
  return {
    videos: data?.videos,
    ...rest,
  }
}

export const useAddVideoView = (opts?: Omit<MutationHookOptions<AddVideoViewMutation>, 'variables'>) => {
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

export const useBasicVideos = (
  variables?: GetBasicVideosQueryVariables,
  opts?: QueryHookOptions<GetBasicVideosQuery, GetBasicVideosQueryVariables>
) => {
  const { data, ...rest } = useGetBasicVideosQuery({ ...opts, variables })
  return {
    videos: data?.videos,
    ...rest,
  }
}

type MostViewedVideosQueryOpts = QueryHookOptions<GetMostViewedVideosQuery, GetMostViewedVideosQueryVariables>
export const useMostViewedVideosIds = (
  variables?: GetMostViewedVideosQueryVariables,
  opts?: MostViewedVideosQueryOpts
) => {
  const { data, ...rest } = useGetMostViewedVideosQuery({ ...opts, variables })
  return {
    mostViewedVideos: data?.mostViewedVideos,
    ...rest,
  }
}

export const useMostViewedVideos = (
  variables?: GetMostViewedVideosQueryVariables,
  opts?: MostViewedVideosQueryOpts
) => {
  const { mostViewedVideos, loading, error } = useMostViewedVideosIds(variables, opts)

  const mostViewedVideosIds = mostViewedVideos?.map((item) => item.id)

  const { videos, ...rest } = useVideos(
    {
      where: {
        id_in: mostViewedVideosIds,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
        isPublic_eq: true,
        isCensored_eq: false,
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

export const useVideoCount = (
  variables?: GetVideoCountQueryVariables,
  opts?: QueryHookOptions<GetVideoCountQuery, GetVideoCountQueryVariables>
) => {
  const { data, ...rest } = useGetVideoCountQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
        ...variables?.where,
      },
    },
  })
  return {
    videoCount: data?.videosConnection.totalCount,
    ...rest,
  }
}

export const useMostViewedVideosAllTimeIds = (
  variables?: GetMostViewedVideosAllTimeQueryVariables,
  opts?: QueryHookOptions<GetMostViewedVideosAllTimeQuery, GetMostViewedVideosAllTimeQueryVariables>
) => {
  const { data, ...rest } = useGetMostViewedVideosAllTimeQuery({ ...opts, variables })
  return {
    mostViewedVideosAllTime: data?.mostViewedVideosAllTime,
    ...rest,
  }
}
