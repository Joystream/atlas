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
  useAddVideoViewMutation,
  useGetBasicVideosQuery,
  useGetFullVideosQuery,
  useGetTop10VideosThisMonthQuery,
  useGetTop10VideosThisWeekQuery,
} from '@/api/queries/__generated__/videos.generated'
import { createVideoWhereObjectWithFilters, publicVideoFilter } from '@/config/contentFilter'

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
        ...createVideoWhereObjectWithFilters(variables?.where),
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
      where: createVideoWhereObjectWithFilters({ ...publicVideoFilter, channel: { id_eq: channelId } }),
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
    variables: {
      ...variables,
      where: createVideoWhereObjectWithFilters(variables?.where),
    },
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
    variables: { where: createVideoWhereObjectWithFilters({ id_eq: id }) },
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
      where: createVideoWhereObjectWithFilters(variables?.where),
    },
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
    variables: {
      ...variables,
      where: createVideoWhereObjectWithFilters(variables?.where),
    },
  })
  return {
    videos: data?.mostViewedVideosConnection.edges.map((video) => video.node),
    ...rest,
  }
}
