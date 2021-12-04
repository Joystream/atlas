import { MutationHookOptions, QueryHookOptions } from '@apollo/client'
import { useMemo } from 'react'

import {
  FollowChannelMutation,
  GetBasicChannelQuery,
  GetBasicChannelQueryVariables,
  GetChannelQuery,
  GetChannelQueryVariables,
  GetChannelsQuery,
  GetChannelsQueryVariables,
  GetMostFollowedChannelsAllTimeQuery,
  GetMostFollowedChannelsAllTimeQueryVariables,
  GetMostFollowedChannelsQuery,
  GetMostFollowedChannelsQueryVariables,
  GetMostViewedChannelsAllTimeQuery,
  GetMostViewedChannelsAllTimeQueryVariables,
  GetMostViewedChannelsQuery,
  GetMostViewedChannelsQueryVariables,
  GetVideoCountQuery,
  GetVideoCountQueryVariables,
  UnfollowChannelMutation,
  useFollowChannelMutation,
  useGetBasicChannelQuery,
  useGetChannelQuery,
  useGetChannelsQuery,
  useGetMostFollowedChannelsAllTimeQuery,
  useGetMostFollowedChannelsQuery,
  useGetMostViewedChannelsAllTimeQuery,
  useGetMostViewedChannelsQuery,
  useGetVideoCountQuery,
  useUnfollowChannelMutation,
} from '@/api/queries'

export const useBasicChannel = (
  id: string,
  opts?: QueryHookOptions<GetBasicChannelQuery, GetBasicChannelQueryVariables>
) => {
  const { data, ...rest } = useGetBasicChannelQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    channel: data?.channelByUniqueInput,
    ...rest,
  }
}

export const useChannel = (id: string, opts?: QueryHookOptions<GetChannelQuery, GetChannelQueryVariables>) => {
  const { data, ...rest } = useGetChannelQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    channel: data?.channelByUniqueInput,
    ...rest,
  }
}

export const useChannelVideoCount = (
  channelId: string,
  createdAt_gte?: Date,
  opts?: QueryHookOptions<GetVideoCountQuery, GetVideoCountQueryVariables>
) => {
  const { data, ...rest } = useGetVideoCountQuery({
    ...opts,
    variables: {
      where: {
        channel: {
          id_eq: channelId,
        },
        media: {
          isAccepted_eq: true,
        },
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        isPublic_eq: true,
        isCensored_eq: false,
        createdAt_gte: createdAt_gte,
      },
    },
  })
  return {
    videoCount: data?.videosConnection.totalCount,
    ...rest,
  }
}

export const useChannels = (
  variables?: GetChannelsQueryVariables,
  opts?: QueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetChannelsQuery({ ...opts, variables })
  return {
    channels: data?.channels,
    ...rest,
  }
}

export const useFollowChannel = (opts?: MutationHookOptions<FollowChannelMutation>) => {
  const [followChannel, rest] = useFollowChannelMutation()
  return {
    followChannel: (id: string) =>
      followChannel({
        ...opts,
        variables: {
          channelId: id,
        },
        update: (cache, mutationResult) => {
          cache.modify({
            id: cache.identify({
              __typename: 'Channel',
              id,
            }),
            fields: {
              follows: () => mutationResult.data?.followChannel.follows,
            },
          })
        },
      }),
    ...rest,
  }
}

export const useUnfollowChannel = (opts?: MutationHookOptions<UnfollowChannelMutation>) => {
  const [unfollowChannel, rest] = useUnfollowChannelMutation()
  return {
    unfollowChannel: (id: string) =>
      unfollowChannel({
        ...opts,
        variables: {
          channelId: id,
        },
        update: (cache, mutationResult) => {
          cache.modify({
            id: cache.identify({
              __typename: 'Channel',
              id,
            }),
            fields: {
              follows: () => mutationResult.data?.unfollowChannel.follows,
            },
          })
        },
      }),
    ...rest,
  }
}

type MostFollowedChannelsQueryOpts = QueryHookOptions<
  GetMostFollowedChannelsQuery,
  GetMostFollowedChannelsQueryVariables
>
export const useMostFollowedChannelsIds = (
  variables?: GetMostFollowedChannelsQueryVariables,
  opts?: MostFollowedChannelsQueryOpts
) => {
  const { data, ...rest } = useGetMostFollowedChannelsQuery({ ...opts, variables })
  return {
    mostFollowedChannels: data?.mostFollowedChannels,
    ...rest,
  }
}

export const useMostFollowedChannels = (
  variables?: GetMostFollowedChannelsQueryVariables,
  opts?: MostFollowedChannelsQueryOpts
) => {
  const { mostFollowedChannels } = useMostFollowedChannelsIds(variables, opts)

  const mostFollowedChannelsIds = mostFollowedChannels?.map((item) => item.id)

  const { channels, ...rest } = useChannels(
    {
      where: {
        id_in: mostFollowedChannelsIds,
      },
    },
    { skip: !mostFollowedChannelsIds }
  )

  return {
    channels,
    ...rest,
  }
}

type MostViewedChannelsQueryOpts = QueryHookOptions<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>
export const useMostViewedChannelsIds = (
  variables?: GetMostViewedChannelsQueryVariables,
  opts?: MostViewedChannelsQueryOpts
) => {
  const { data, ...rest } = useGetMostViewedChannelsQuery({ ...opts, variables })
  return {
    mostViewedChannels: data?.mostViewedChannels,
    ...rest,
  }
}

export const useMostViewedChannels = (
  variables?: GetMostViewedChannelsQueryVariables,
  opts?: MostViewedChannelsQueryOpts
) => {
  const { mostViewedChannels } = useMostViewedChannelsIds(variables, opts)

  const mostViewedChannelsIds = mostViewedChannels?.map((item) => item.id)

  const { channels, ...rest } = useChannels(
    {
      where: {
        id_in: mostViewedChannelsIds,
      },
    },
    { skip: !mostViewedChannelsIds }
  )

  const sortedChannels = useMemo(() => {
    if (channels) {
      return [...channels].sort((a, b) => (b.follows || 0) - (a.follows || 0))
    }
    return null
  }, [channels])

  return {
    channels: sortedChannels,
    ...rest,
  }
}

type MostFollowedChannelsAllTimeQueryOpts = QueryHookOptions<
  GetMostFollowedChannelsAllTimeQuery,
  GetMostFollowedChannelsAllTimeQueryVariables
>
export const useMostFollowedChannelsAllTimeIds = (
  variables?: GetMostFollowedChannelsAllTimeQueryVariables,
  opts?: MostFollowedChannelsAllTimeQueryOpts
) => {
  const { data, ...rest } = useGetMostFollowedChannelsAllTimeQuery({ ...opts, variables })
  return {
    mostFollowedChannelsAllTime: data?.mostFollowedChannelsAllTime,
    ...rest,
  }
}

export const useMostFollowedChannelsAllTime = (
  variables?: GetMostFollowedChannelsAllTimeQueryVariables,
  opts?: MostFollowedChannelsAllTimeQueryOpts
) => {
  const { mostFollowedChannelsAllTime } = useMostFollowedChannelsAllTimeIds(variables, opts)

  const mostFollowedChannelsAllTimeIds = mostFollowedChannelsAllTime?.map((item) => item.id)

  const { channels, ...rest } = useChannels(
    {
      where: {
        id_in: mostFollowedChannelsAllTimeIds,
      },
    },
    { skip: !mostFollowedChannelsAllTimeIds }
  )

  const sortedChannels = useMemo(() => {
    if (channels) {
      return [...channels].sort((a, b) => (b.follows || 0) - (a.follows || 0))
    }
    return null
  }, [channels])

  return {
    channels: sortedChannels,
    ...rest,
  }
}

type MostViewedChannelsAllTimeQueryOpts = QueryHookOptions<
  GetMostViewedChannelsAllTimeQuery,
  GetMostViewedChannelsAllTimeQueryVariables
>
export const useMostViewedChannelsAllTimeIds = (
  variables?: GetMostViewedChannelsAllTimeQueryVariables,
  opts?: MostViewedChannelsAllTimeQueryOpts
) => {
  const { data, ...rest } = useGetMostViewedChannelsAllTimeQuery({ ...opts, variables })
  return {
    mostViewedChannelsAllTime: data?.mostViewedChannelsAllTime,
    ...rest,
  }
}

export const useMostViewedChannelsAllTime = (
  variables?: GetMostViewedChannelsAllTimeQueryVariables,
  opts?: MostViewedChannelsAllTimeQueryOpts
) => {
  const { mostViewedChannelsAllTime } = useMostViewedChannelsAllTimeIds(variables, opts)

  const mostViewedChannelsIds = mostViewedChannelsAllTime?.map((item) => item.id)

  const { channels, ...rest } = useChannels(
    {
      where: {
        id_in: mostViewedChannelsIds,
      },
    },
    { skip: !mostViewedChannelsIds }
  )

  return {
    channels,
    ...rest,
  }
}
