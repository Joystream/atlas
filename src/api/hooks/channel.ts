import { MutationHookOptions, QueryHookOptions } from '@apollo/client'
import { useMemo } from 'react'

import {
  AssetAvailability,
  FollowChannelMutation,
  GetBasicChannelQuery,
  GetChannelQuery,
  GetChannelsQuery,
  GetChannelsQueryVariables,
  GetMostFollowedChannelsAllTimeQuery,
  GetMostFollowedChannelsAllTimeQueryVariables,
  GetMostViewedChannelsAllTimeQuery,
  GetMostViewedChannelsAllTimeQueryVariables,
  GetMostViewedChannelsQuery,
  GetMostViewedChannelsQueryVariables,
  GetVideoCountQuery,
  UnfollowChannelMutation,
  useFollowChannelMutation,
  useGetBasicChannelQuery,
  useGetChannelQuery,
  useGetChannelsQuery,
  useGetMostFollowedChannelsAllTimeQuery,
  useGetMostViewedChannelsAllTimeQuery,
  useGetMostViewedChannelsQuery,
  useGetVideoCountQuery,
  useUnfollowChannelMutation,
} from '@/api/queries'

type BasicChannelOpts = QueryHookOptions<GetBasicChannelQuery>
export const useBasicChannel = (id: string, opts?: BasicChannelOpts) => {
  const { data, ...rest } = useGetBasicChannelQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    channel: data?.channelByUniqueInput,
    ...rest,
  }
}

type ChannelOpts = QueryHookOptions<GetChannelQuery>
export const useChannel = (id: string, opts?: ChannelOpts) => {
  const { data, ...rest } = useGetChannelQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    channel: data?.channelByUniqueInput,
    ...rest,
  }
}

type VideoCountOpts = QueryHookOptions<GetVideoCountQuery>
export const useChannelVideoCount = (channelId: string, createdAt_gte?: Date, opts?: VideoCountOpts) => {
  const { data, ...rest } = useGetVideoCountQuery({
    ...opts,
    variables: {
      where: {
        channelId_eq: channelId,
        thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
        mediaAvailability_eq: AssetAvailability.Accepted,
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

type ChannelsOpts = QueryHookOptions<GetChannelsQuery>
export const useChannels = (variables?: GetChannelsQueryVariables, opts?: ChannelsOpts) => {
  const { data, ...rest } = useGetChannelsQuery({ ...opts, variables })
  return {
    channels: data?.channels,
    ...rest,
  }
}

type FollowChannelOpts = MutationHookOptions<FollowChannelMutation>
export const useFollowChannel = (opts?: FollowChannelOpts) => {
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

type UnfollowChannelOpts = MutationHookOptions<UnfollowChannelMutation>
export const useUnfollowChannel = (opts?: UnfollowChannelOpts) => {
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

type MostPopularChannelsOpts = QueryHookOptions<GetMostViewedChannelsQuery>
export const useMostViewedChannelsIds = (
  variables?: GetMostViewedChannelsQueryVariables,
  opts?: MostPopularChannelsOpts
) => {
  const { data, ...rest } = useGetMostViewedChannelsQuery({ ...opts, variables })
  return {
    mostViewedChannels: data?.mostViewedChannels,
    ...rest,
  }
}

export const useMostViewedChannels = (
  variables?: GetMostViewedChannelsQueryVariables,
  opts?: MostPopularChannelsOpts
) => {
  const { mostViewedChannels } = useMostViewedChannelsIds(variables, opts)

  const mostViewedChannelsIds = useMemo(() => {
    if (mostViewedChannels) {
      return mostViewedChannels.map((item) => item.id)
    }
    return null
  }, [mostViewedChannels])

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

type MostFollowedChannelsAllTimeOpts = QueryHookOptions<GetMostFollowedChannelsAllTimeQuery>
export const useMostFollowedChannelsAllTimeIds = (
  variables?: GetMostFollowedChannelsAllTimeQueryVariables,
  opts?: MostFollowedChannelsAllTimeOpts
) => {
  const { data, ...rest } = useGetMostFollowedChannelsAllTimeQuery({ ...opts, variables })
  return {
    mostFollowedChannelsAllTime: data?.mostFollowedChannelsAllTime,
    ...rest,
  }
}

export const useMostFollowedChannelsAllTime = (
  variables?: GetMostFollowedChannelsAllTimeQueryVariables,
  opts?: MostPopularChannelsOpts
) => {
  const { mostFollowedChannelsAllTime } = useMostFollowedChannelsAllTimeIds(variables, opts)

  const mostFollowedChannelsAllTimeIds = useMemo(() => {
    if (mostFollowedChannelsAllTime) {
      return mostFollowedChannelsAllTime.map((item) => item.id)
    }
    return null
  }, [mostFollowedChannelsAllTime])

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

type MostPopularChannelsAllTimeOpts = QueryHookOptions<GetMostViewedChannelsAllTimeQuery>
export const useMostViewedChannelsAllTimeIds = (
  variables?: GetMostViewedChannelsAllTimeQueryVariables,
  opts?: MostPopularChannelsAllTimeOpts
) => {
  const { data, ...rest } = useGetMostViewedChannelsAllTimeQuery({ ...opts, variables })
  return {
    mostViewedChannelsAllTime: data?.mostViewedChannelsAllTime,
    ...rest,
  }
}

export const useMostViewedChannelsAllTime = (
  variables?: GetMostViewedChannelsAllTimeQueryVariables,
  opts?: MostPopularChannelsOpts
) => {
  const { mostViewedChannelsAllTime } = useMostViewedChannelsAllTimeIds(variables, opts)

  const mostViewedChannelsIds = useMemo(() => {
    if (mostViewedChannelsAllTime) {
      return mostViewedChannelsAllTime.map((item) => item.id)
    }
    return null
  }, [mostViewedChannelsAllTime])

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
