import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
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
  GetVideosCountQuery,
  GetVideosCountQueryVariables,
  useAddVideoViewMutation,
  useGetBasicVideosQuery,
  useGetFullVideosQuery,
  useGetTop10VideosThisMonthQuery,
  useGetTop10VideosThisWeekQuery,
  useGetVideosCountQuery,
} from '@/api/queries/__generated__/videos.generated'
import { publicVideoFilter } from '@/config/contentFilter'

export const useFullVideo = (
  id: string,
  opts?: QueryHookOptions<GetFullVideosQuery, GetFullVideosQueryVariables>,
  variables?: GetFullVideosQueryVariables
) => {
  const { data, ...queryRest } = useGetFullVideosQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        id_eq: id,
        ...variables?.where,
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
      where: { ...publicVideoFilter, channel: { id_eq: channelId } },
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
          id: mutationResult.data?.addVideoView.videoId,
        }),
        fields: {
          viewsNum: () => mutationResult.data?.addVideoView.viewsNum,
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
  const { data, ...queryRest } = useGetBasicVideosQuery({
    ...opts,
    variables,
  })
  return {
    videos: data?.videos,
    ...queryRest,
  }
}

export const useBasicVideo = (
  id: string,
  opts?: QueryHookOptions<GetBasicVideosQuery, GetBasicVideosQueryVariables>
) => {
  const { data, ...rest } = useGetBasicVideosQuery({
    ...opts,
    variables: { where: { id_eq: id } },
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
    variables,
  })
  return {
    videos: data?.mostViewedVideosConnection.edges.map((video) => video.node),
    ...rest,
  }
}

export const useTop10VideosThisMonth = (
  variables?: GetTop10VideosThisMonthQueryVariables,
  opts?: QueryHookOptions<GetTop10VideosThisMonthQuery, GetTop10VideosThisMonthQueryVariables>
) => {
  const { data, ...rest } = useGetTop10VideosThisMonthQuery({
    ...opts,
    variables,
  })
  return {
    videos: data?.mostViewedVideosConnection.edges.map((video) => video.node),
    ...rest,
  }
}

export const useVideoCount = (
  variables?: GetBasicVideosQueryVariables,
  opts?: QueryHookOptions<GetVideosCountQuery, GetVideosCountQueryVariables>
) => {
  const { data, ...rest } = useGetVideosCountQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...variables?.where,
      },
    },
  })
  return {
    videoCount: data?.videosConnection.totalCount,
    ...rest,
  }
}

export const useBasicVideoPagination = (
  baseOptions?: QueryHookOptions<GetBasicVideosQuery, GetBasicVideosQueryVariables>
) => {
  const { videoCount } = useVideoCount({ where: baseOptions?.variables?.where })
  const { data, ...rest } = useGetBasicVideosQuery({
    notifyOnNetworkStatusChange: true,
    ...baseOptions,
  })

  return {
    ...rest,
    totalCount: videoCount,
    videos: data?.videos,
  }
}
