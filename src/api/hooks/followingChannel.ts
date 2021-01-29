import { useFollowChannelMutation, useUnfollowChannelMutation } from '../queries/__generated__/channels.generated'

const useFollowingChannel = (id: string) => {
  const [followChannel] = useFollowChannelMutation({
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
  })
  const [unfollowChannel] = useUnfollowChannelMutation({
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
  })
  return {
    followChannel,
    unfollowChannel,
  }
}

export default useFollowingChannel
