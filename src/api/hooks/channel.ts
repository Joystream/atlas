import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  AssetAvailability,
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
export const useMostFollowedChannels = (
  variables: GetMostFollowedChannelsQueryVariables,
  opts?: MostFollowedChannelsQueryOpts
) => {
  const { data, ...rest } = useGetMostFollowedChannelsQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        ...variables.where,
        isCensored_eq: false,
        isPublic_eq: true,
      },
    },
  })
  return {
    channels: data?.mostFollowedChannels.edges.map((edge) => edge.node),
    ...rest,
  }
}

type MostViewedChannelsQueryOpts = QueryHookOptions<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>
export const useMostViewedChannels = (
  variables?: GetMostViewedChannelsQueryVariables,
  opts?: MostViewedChannelsQueryOpts
) => {
  const { data, ...rest } = useGetMostViewedChannelsQuery({ ...opts, variables })
  return {
    channels: data?.mostViewedChannels.edges.map((edge) => edge.node),
    ...rest,
  }
}

type MostFollowedChannelsAllTimeQueryOpts = QueryHookOptions<
  GetMostFollowedChannelsAllTimeQuery,
  GetMostFollowedChannelsAllTimeQueryVariables
>
export const useMostFollowedChannelsAllTime = (
  variables?: GetMostFollowedChannelsAllTimeQueryVariables,
  opts?: MostFollowedChannelsAllTimeQueryOpts
) => {
  const { data, ...rest } = useGetMostFollowedChannelsAllTimeQuery({ ...opts, variables })
  return {
    channels: data?.mostFollowedChannelsAllTime.edges.map((edge) => edge.node),
    ...rest,
  }
}

type MostViewedChannelsAllTimeQueryOpts = QueryHookOptions<
  GetMostViewedChannelsAllTimeQuery,
  GetMostViewedChannelsAllTimeQueryVariables
>
export const useMostViewedChannelsAllTime = (
  variables?: GetMostViewedChannelsAllTimeQueryVariables,
  opts?: MostViewedChannelsAllTimeQueryOpts
) => {
  const { data, ...rest } = useGetMostViewedChannelsAllTimeQuery({ ...opts, variables })
  return {
    channels: data?.mostViewedChannelsAllTime.edges.map((edge) => edge.node),
    ...rest,
  }
}
