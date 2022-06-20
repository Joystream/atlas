import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  AddVideoViewMutation,
  GetBasicVideoQuery,
  GetBasicVideoQueryVariables,
  GetBasicVideosQuery,
  GetBasicVideosQueryVariables,
  GetFullVideoQuery,
  GetFullVideoQueryVariables,
  GetTop10VideosThisMonthQuery,
  GetTop10VideosThisMonthQueryVariables,
  GetTop10VideosThisWeekQuery,
  GetTop10VideosThisWeekQueryVariables,
  GetVideoCountQuery,
  GetVideoCountQueryVariables,
  VideoOrderByInput,
  useAddVideoViewMutation,
  useGetBasicVideoQuery,
  useGetBasicVideosQuery,
  useGetFullVideoQuery,
  useGetTop10VideosThisMonthQuery,
  useGetTop10VideosThisWeekQuery,
  useGetVideoCountQuery,
} from '@/api/queries'

export const useFullVideo = (id: string, opts?: QueryHookOptions<GetFullVideoQuery, GetFullVideoQueryVariables>) => {
  const { data, ...queryRest } = useGetFullVideoQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    video: data?.videoByUniqueInput,
    ...queryRest,
  }
}

export const useChannelPreviewVideos = (
  channelId: string | null | undefined,
  opts?: QueryHookOptions<GetBasicVideosQuery, GetBasicVideosQueryVariables>
) => {
  const { data, ...rest } = useGetBasicVideosQuery({
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
  const { data, ...rest } = useGetBasicVideosQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...variables?.where,
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
      },
    },
  })
  return {
    videos: data?.videos,
    ...rest,
  }
}

export const useBasicVideo = (id: string, opts?: QueryHookOptions<GetBasicVideoQuery, GetBasicVideoQueryVariables>) => {
  const { data, ...rest } = useGetBasicVideoQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    video: data?.videoByUniqueInput,
    ...rest,
  }
}

export const useTop10VideosThisWeek = (
  variables?: GetTop10VideosThisWeekQueryVariables,
  opts?: QueryHookOptions<GetTop10VideosThisWeekQuery, GetTop10VideosThisWeekQueryVariables>
) => {
  const { data, ...rest } = useGetTop10VideosThisWeekQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...variables?.where,
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
      },
    },
  })
  return {
    videos: data?.top10VideosThisWeek,
    ...rest,
  }
}

export const useTop10VideosThisMonth = (
  variables?: GetTop10VideosThisMonthQueryVariables,
  opts?: QueryHookOptions<GetTop10VideosThisMonthQuery, GetTop10VideosThisMonthQueryVariables>
) => {
  const { data, ...rest } = useGetTop10VideosThisMonthQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...variables?.where,
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
      },
    },
  })
  return {
    videos: data?.top10VideosThisMonth,
    ...rest,
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
