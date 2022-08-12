import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  AddVideoViewMutation,
  GetBasicVideosQuery,
  GetBasicVideosQueryVariables,
  GetFullVideosQuery,
  GetFullVideosQueryVariables,
  GetTop10VideosThisMonthQuery,
  GetTop10VideosThisMonthQueryVariables,
  GetTop10VideosThisWeekQuery,
  GetTop10VideosThisWeekQueryVariables,
  GetVideoCountQuery,
  GetVideoCountQueryVariables,
  VideoOrderByInput,
  useAddVideoViewMutation,
  useGetBasicVideosQuery,
  useGetFullVideosQuery,
  useGetTop10VideosThisMonthQuery,
  useGetTop10VideosThisWeekQuery,
  useGetVideoCountQuery,
} from '@/api/queries'
import { videoFilter } from '@/config/videoFilter'

export const useFullVideo = (id: string, opts?: QueryHookOptions<GetFullVideosQuery, GetFullVideosQueryVariables>) => {
  const { data, ...queryRest } = useGetFullVideosQuery({
    ...opts,
    variables: {
      where: {
        id_eq: id,
        ...videoFilter,
        isPublic_eq: undefined,
        isCensored_eq: undefined,
        media: undefined,
        thumbnailPhoto: undefined,
      },
    },
  })
  return {
    video: data?.videos[0],
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
        ...videoFilter,
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
        ...videoFilter,
        ...variables?.where,
      },
    },
  })
  return {
    videos: data?.videos,
    ...rest,
  }
}

export const useBasicVideo = (
  id: string,
  opts?: QueryHookOptions<GetBasicVideosQuery, GetBasicVideosQueryVariables>
) => {
  const { data, ...rest } = useGetBasicVideosQuery({
    ...opts,
    variables: { where: { id_eq: id, ...videoFilter } },
  })
  return {
    video: data?.videos[0],
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
        ...videoFilter,
        ...variables?.where,
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
        ...videoFilter,
        ...variables?.where,
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
        ...videoFilter,
        ...variables?.where,
      },
    },
  })
  return {
    videoCount: data?.videosConnection.totalCount,
    ...rest,
  }
}
