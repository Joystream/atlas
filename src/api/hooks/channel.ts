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
  GetMostFollowedChannelsQuery,
  GetMostFollowedChannelsQueryVariables,
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
  useGetMostFollowedChannelsQuery,
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

type MostFollowedChannelsOpts = QueryHookOptions<GetMostFollowedChannelsQuery>
export const useMostFollowedChannelsIds = (
  variables?: GetMostFollowedChannelsQueryVariables,
  opts?: MostFollowedChannelsOpts
) => {
  const { data, ...rest } = useGetMostFollowedChannelsQuery({ ...opts, variables })
  return {
    mostFollowedChannels: data?.mostFollowedChannels,
    ...rest,
  }
}

export const useMostFollowedChannels = (
  variables?: GetMostFollowedChannelsQueryVariables,
  opts?: MostFollowedChannelsOpts
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

type MostViewedChannelsOpts = QueryHookOptions<GetMostViewedChannelsQuery>
export const useMostViewedChannelsIds = (
  variables?: GetMostViewedChannelsQueryVariables,
  opts?: MostViewedChannelsOpts
) => {
  const { data, ...rest } = useGetMostViewedChannelsQuery({ ...opts, variables })
  return {
    mostViewedChannels: data?.mostViewedChannels,
    ...rest,
  }
}

export const useMostViewedChannels = (
  variables?: GetMostViewedChannelsQueryVariables,
  opts?: MostViewedChannelsOpts
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
  opts?: MostFollowedChannelsAllTimeOpts
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

type MostViewedChannelsAllTimeOpts = QueryHookOptions<GetMostViewedChannelsAllTimeQuery>
export const useMostViewedChannelsAllTimeIds = (
  variables?: GetMostViewedChannelsAllTimeQueryVariables,
  opts?: MostViewedChannelsAllTimeOpts
) => {
  const { data, ...rest } = useGetMostViewedChannelsAllTimeQuery({ ...opts, variables })
  return {
    mostViewedChannelsAllTime: data?.mostViewedChannelsAllTime,
    ...rest,
  }
}

export const useMostViewedChannelsAllTime = (
  variables?: GetMostViewedChannelsAllTimeQueryVariables,
  opts?: MostViewedChannelsAllTimeOpts
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
