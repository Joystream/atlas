import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  FollowChannelMutation,
  GetChannelNftCollectorsQuery,
  GetChannelNftCollectorsQueryVariables,
  GetDiscoverChannelsQuery,
  GetDiscoverChannelsQueryVariables,
  GetExtendedBasicChannelsQuery,
  GetExtendedBasicChannelsQueryVariables,
  GetExtendedFullChannelsQuery,
  GetExtendedFullChannelsQueryVariables,
  GetPopularChannelsQuery,
  GetPopularChannelsQueryVariables,
  GetPromisingChannelsQuery,
  GetPromisingChannelsQueryVariables,
  GetTop10ChannelsQuery,
  GetTop10ChannelsQueryVariables,
  UnfollowChannelMutation,
  useFollowChannelMutation,
  useGetChannelNftCollectorsQuery,
  useGetDiscoverChannelsQuery,
  useGetExtendedBasicChannelsQuery,
  useGetExtendedFullChannelsQuery,
  useGetPopularChannelsQuery,
  useGetPromisingChannelsQuery,
  useGetTop10ChannelsQuery,
  useUnfollowChannelMutation,
} from '@/api/queries/__generated__/channels.generated'
import { channelFilter } from '@/config/contentFilter'

const CHANNEL_ID_FILTER = channelFilter.id_not_contains

export const useBasicChannel = (
  id: string,
  opts?: QueryHookOptions<GetExtendedBasicChannelsQuery, GetExtendedBasicChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetExtendedBasicChannelsQuery({
    ...opts,
    variables: {
      where: { channel: { id_eq: id, id_not_contains: CHANNEL_ID_FILTER } },
    },
  })
  return {
    extendedChannel: data?.extendedChannels[0],
    ...rest,
  }
}

export const useFullChannel = (
  id: string,
  opts?: QueryHookOptions<GetExtendedFullChannelsQuery, GetExtendedFullChannelsQueryVariables>,
  variables?: GetExtendedFullChannelsQueryVariables
) => {
  const { data, ...rest } = useGetExtendedFullChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        channel: {
          id_not_contains: CHANNEL_ID_FILTER,
          id_eq: id,
        },
        ...variables?.where,
      },
    },
  })
  return {
    extendedChannel: data?.extendedChannels[0].channel,
    ...rest,
  }
}

export const useBasicChannels = (
  variables?: GetExtendedBasicChannelsQueryVariables,
  opts?: QueryHookOptions<GetExtendedBasicChannelsQuery, GetExtendedBasicChannelsQueryVariables>
) => {
  const { data, ...rest } = useGetExtendedBasicChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...variables?.where,
      },
    },
  })
  return {
    channels: data?.extendedChannels.map((extendedChannel) => extendedChannel),
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
        activeVideosCount_gt: 0,
        ...variables?.where,
      },
    },
  })
  return {
    channels: data?.extendedChannels.map((extended) => extended.channel),
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
        activeVideosCount_gt: 0,
        ...variables?.where,
      },
    },
  })
  return {
    channels: data?.mostRecentChannels,
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
        activeVideosCount_gt: 0,
        ...variables?.where,
      },
    },
  })
  return {
    channels: data?.mostRecentChannels,
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
        activeVideosCount_gt: 0,
        ...variables?.where,
      },
    },
  })
  return {
    channels: data?.extendedChannels,
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
      // Todo change later?
      channelId: variables?.channelId || '',
      orderBy: variables?.orderBy,
    },
  })

  return {
    channelNftCollectors: data?.channelNftCollectors,
    ...rest,
  }
}
