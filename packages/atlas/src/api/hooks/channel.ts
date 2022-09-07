import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  FollowChannelMutation,
  GetBasicChannelsQuery,
  GetBasicChannelsQueryVariables,
  GetChannelNftCollectorsQuery,
  GetChannelNftCollectorsQueryVariables,
  GetDiscoverChannelsQuery,
  GetDiscoverChannelsQueryVariables,
  GetFullChannelsQuery,
  GetFullChannelsQueryVariables,
  GetPopularChannelsQuery,
  GetPopularChannelsQueryVariables,
  GetPromisingChannelsQuery,
  GetPromisingChannelsQueryVariables,
  GetTop10ChannelsQuery,
  GetTop10ChannelsQueryVariables,
  UnfollowChannelMutation,
  useFollowChannelMutation,
  useGetBasicChannelsQuery,
  useGetChannelNftCollectorsQuery,
  useGetDiscoverChannelsQuery,
  useGetFullChannelsQuery,
  useGetPopularChannelsQuery,
  useGetPromisingChannelsQuery,
  useGetTop10ChannelsQuery,
  useUnfollowChannelMutation,
} from '@/api/queries/__generated__/channels.generated'
import { channelFilter } from '@/config/contentFilter'

const CHANNEL_ID_FILTER = channelFilter.NOT?.find((item) => item.id_in)

export const useBasicChannel = (
  id: string,
  opts?: QueryHookOptions<GetBasicChannelsQuery, GetBasicChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetBasicChannelsQuery({
    ...opts,
    variables: { where: { id_eq: id, ...(CHANNEL_ID_FILTER ? { NOT: [{ id_in: CHANNEL_ID_FILTER.id_in }] } : {}) } },
  })
  return {
    channel: data?.channels[0],
    ...rest,
  }
}

export const useFullChannel = (
  id: string,
  opts?: QueryHookOptions<GetFullChannelsQuery, GetFullChannelsQueryVariables>,
  variables?: GetFullChannelsQueryVariables
) => {
  const { data, ...rest } = useGetFullChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        id_eq: id,
        ...(CHANNEL_ID_FILTER ? { NOT: [{ id_in: CHANNEL_ID_FILTER.id_in }] } : {}),
        ...variables?.where,
      },
    },
  })
  return {
    channel: data?.channels[0],
    ...rest,
  }
}

export const useBasicChannels = (
  variables?: GetBasicChannelsQueryVariables,
  opts?: QueryHookOptions<GetBasicChannelsQuery, GetBasicChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetBasicChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...channelFilter,
        ...variables?.where,
      },
    },
  })
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

export const useTop10Channels = (
  variables?: GetTop10ChannelsQueryVariables,
  opts?: QueryHookOptions<GetTop10ChannelsQuery, GetTop10ChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetTop10ChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...channelFilter,
        activeVideosCounter_gt: 0,
        ...variables?.where,
      },
    },
  })
  return {
    channels: data?.top10Channels,
    ...rest,
  }
}

export const useDiscoverChannels = (
  variables?: GetDiscoverChannelsQueryVariables,
  opts?: QueryHookOptions<GetDiscoverChannelsQuery, GetDiscoverChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetDiscoverChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...channelFilter,
        activeVideosCounter_gt: 0,
        ...variables?.where,
      },
    },
  })
  return {
    channels: data?.discoverChannels,
    ...rest,
  }
}

export const usePromisingChannels = (
  variables?: GetPromisingChannelsQueryVariables,
  opts?: QueryHookOptions<GetPromisingChannelsQuery, GetPromisingChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetPromisingChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...channelFilter,
        activeVideosCounter_gt: 0,
        ...variables?.where,
      },
    },
  })
  return {
    channels: data?.promisingChannels,
    ...rest,
  }
}

export const usePopularChannels = (
  variables?: GetPopularChannelsQueryVariables,
  opts?: QueryHookOptions<GetPopularChannelsQuery, GetPopularChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetPopularChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...channelFilter,
        activeVideosCounter_gt: 0,
        ...variables?.where,
      },
    },
  })
  return {
    channels: data?.popularChannels,
    ...rest,
  }
}

export const useChannelNftCollectors = (
  variables?: GetChannelNftCollectorsQueryVariables,
  opts?: QueryHookOptions<GetChannelNftCollectorsQuery, GetChannelNftCollectorsQueryVariables>
) => {
  const { data, ...rest } = useGetChannelNftCollectorsQuery({
    ...opts,
    variables: {
      ...variables,
      where: { ...variables?.where, ...(CHANNEL_ID_FILTER ? { NOT: [{ id_in: CHANNEL_ID_FILTER.id_in }] } : {}) },
    },
  })

  return {
    channelNftCollectors: data?.channelNftCollectors,
    ...rest,
  }
}
