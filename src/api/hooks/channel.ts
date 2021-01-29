import {
  useGetChannelQuery,
  GetChannelQuery,
  useFollowChannelMutation,
  useUnfollowChannelMutation,
} from '@/api/queries/__generated__/channels.generated'
import { QueryHookOptions, MutationHookOptions } from '@apollo/client'
import { FollowChannelMutation, UnfollowChannelMutation } from '../queries/__generated__/channels.generated'

type Opts = QueryHookOptions<GetChannelQuery>
const useChannel = (id: string, opts?: Opts) => {
  const { data, ...rest } = useGetChannelQuery({
    ...opts,
    variables: { id },
  })
  return {
    channel: data?.channel,
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

export default useChannel
