import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  AddVideoViewMutation,
  AssetAvailability,
  GetBasicVideosQuery,
  GetBasicVideosQueryVariables,
  GetTop10VideosThisMonthQuery,
  GetTop10VideosThisMonthQueryVariables,
  GetTop10VideosThisWeekQuery,
  GetTop10VideosThisWeekQueryVariables,
  GetVideoCountQuery,
  GetVideoCountQueryVariables,
  GetVideoQuery,
  GetVideoQueryVariables,
  GetVideosQuery,
  VideoOrderByInput,
  useAddVideoViewMutation,
  useGetBasicVideosQuery,
  useGetTop10VideosThisMonthQuery,
  useGetTop10VideosThisWeekQuery,
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

export const useChannelPreviewVideos = (
  channelId: string | null | undefined,
  opts?: QueryHookOptions<GetVideosQuery>
) => {
  const { data, ...rest } = useGetVideosQuery({
    ...opts,
    variables: {
      where: {
        channelId_eq: channelId,
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
        mediaAvailability_eq: AssetAvailability.Accepted,
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
        thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
        mediaAvailability_eq: AssetAvailability.Accepted,
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
        thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
        mediaAvailability_eq: AssetAvailability.Accepted,
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
        thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
        mediaAvailability_eq: AssetAvailability.Accepted,
        isPublic_eq: true,
        isCensored_eq: false,
        ...variables?.where,
      },
    },
  })
  return {
    videoCount: data?.videosConnection.totalCount,
    ...rest,
  }
}
