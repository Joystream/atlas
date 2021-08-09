import { MutationHookOptions, QueryHookOptions } from '@apollo/client'
import { useMemo } from 'react'

import {
  AddVideoViewMutation,
  GetBasicVideosQuery,
  GetBasicVideosQueryVariables,
  GetMostViewedVideosAllTimeQuery,
  GetMostViewedVideosAllTimeQueryVariables,
  GetMostViewedVideosQuery,
  GetMostViewedVideosQueryVariables,
  GetVideoQuery,
  GetVideosQuery,
  GetVideosQueryVariables,
  useAddVideoViewMutation,
  useGetBasicVideosQuery,
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
  const { mostViewedVideos } = useMostViewedVideosIds(variables, opts)

  const mostViewedVideosIds = useMemo(() => {
    if (mostViewedVideos) {
      return mostViewedVideos.map((item) => item.id)
    }
    return null
  }, [mostViewedVideos])

  const { videos, ...rest } = useVideos(
    {
      where: {
        id_in: mostViewedVideosIds,
      },
    },
    { skip: !mostViewedVideosIds }
  )

  const sortedVideos = useMemo(() => {
    if (videos) {
      return [...videos].sort((a, b) => (b.views && a.views ? b.views - a.views : 0))
    }
    return null
  }, [videos])

  return {
    videos: sortedVideos,
    ...rest,
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

export const useMostViewedVideosAllTime = (
  variables?: GetMostViewedVideosAllTimeQueryVariables,
  opts?: MostViewedVideosAllTimeOpts
) => {
  const { mostViewedVideosAllTime } = useMostViewedVideosAllTimeIds(variables, opts)

  const mostViewedVideosAllTimeIds = useMemo(() => {
    if (mostViewedVideosAllTime) {
      return mostViewedVideosAllTime.map((item) => item.id)
    }
    return null
  }, [mostViewedVideosAllTime])

  const { videos, ...rest } = useVideos(
    {
      where: {
        id_in: mostViewedVideosAllTimeIds,
      },
    },
    { skip: !mostViewedVideosAllTimeIds }
  )

  const sortedVideos = useMemo(() => {
    if (videos) {
      return [...videos].sort((a, b) => (b.views && a.views ? b.views - a.views : 0))
    }
    return null
  }, [videos])

  return {
    videos: sortedVideos,
    ...rest,
  }
}
