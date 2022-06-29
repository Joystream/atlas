import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  FollowChannelMutation,
  GetBasicChannelQuery,
  GetBasicChannelQueryVariables,
  GetBasicChannelsQuery,
  GetBasicChannelsQueryVariables,
  GetChannelNftCollectorsQuery,
  GetChannelNftCollectorsQueryVariables,
  GetDiscoverChannelsQuery,
  GetDiscoverChannelsQueryVariables,
  GetFullChannelQuery,
  GetFullChannelQueryVariables,
  GetPopularChannelsQuery,
  GetPopularChannelsQueryVariables,
  GetPromisingChannelsQuery,
  GetPromisingChannelsQueryVariables,
  GetTop10ChannelsQuery,
  GetTop10ChannelsQueryVariables,
  UnfollowChannelMutation,
  useFollowChannelMutation,
  useGetBasicChannelQuery,
  useGetBasicChannelsQuery,
  useGetChannelNftCollectorsQuery,
  useGetDiscoverChannelsQuery,
  useGetFullChannelQuery,
  useGetPopularChannelsQuery,
  useGetPromisingChannelsQuery,
  useGetTop10ChannelsQuery,
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

export const useFullChannel = (
  id: string,
  opts?: QueryHookOptions<GetFullChannelQuery, GetFullChannelQueryVariables>
) => {
  const { data, ...rest } = useGetFullChannelQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    channel: data?.channelByUniqueInput,
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
        isCensored_eq: false,
        isPublic_eq: true,
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
        isCensored_eq: false,
        isPublic_eq: true,
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
        isCensored_eq: false,
        isPublic_eq: true,
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
        isCensored_eq: false,
        isPublic_eq: true,
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
        isCensored_eq: false,
        isPublic_eq: true,
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
  const { data, ...rest } = useGetChannelNftCollectorsQuery({ ...opts, variables })

  return {
    channelNftCollectors: data?.channelNftCollectors,
    ...rest,
  }
}
