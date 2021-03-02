import { QueryHookOptions, MutationHookOptions } from '@apollo/client'
import {
  useGetChannelQuery,
  useGetChannelVideoCountQuery,
  useGetChannelsQuery,
  useFollowChannelMutation,
  useUnfollowChannelMutation,
  GetChannelQuery,
  GetChannelVideoCountQuery,
  FollowChannelMutation,
  UnfollowChannelMutation,
  GetChannelsQuery,
  GetChannelsQueryVariables,
  GetBasicChannelQuery,
  useGetBasicChannelQuery,
} from '@/api/queries'

type BasicChannelOpts = QueryHookOptions<GetBasicChannelQuery>
export const useBasicChannel = (id: string, opts?: BasicChannelOpts) => {
  const { data, ...rest } = useGetBasicChannelQuery({
    ...opts,
    variables: { id },
  })
  return {
    channel: data?.channel,
    ...rest,
  }
}

type ChannelOpts = QueryHookOptions<GetChannelQuery>
export const useChannel = (id: string, opts?: ChannelOpts) => {
  const { data, ...rest } = useGetChannelQuery({
    ...opts,
    variables: { id },
  })
  return {
    channel: data?.channel,
    ...rest,
  }
}

type VideoCountOpts = QueryHookOptions<GetChannelVideoCountQuery>
export const useChannelVideoCount = (channelId: string, opts?: VideoCountOpts) => {
  const { data, ...rest } = useGetChannelVideoCountQuery({
    ...opts,
    variables: { channelId },
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
