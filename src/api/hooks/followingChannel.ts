import { useMutation } from '@apollo/client'
import { FOLLOW_CHANNEL, UNFOLLOW_CHANNEL } from '@/api/queries/channels'
import { FollowChannel, FollowChannelVariables } from '@/api/queries/__generated__/followChannel'
import { UnfollowChannel, UnfollowChannelVariables } from '@/api/queries/__generated__/unfollowChannel'

const useFollowingChannel = (id: string) => {
  const [followChannel] = useMutation<FollowChannel, FollowChannelVariables>(FOLLOW_CHANNEL, {
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
  const [unfollowChannel] = useMutation<UnfollowChannel, UnfollowChannelVariables>(UNFOLLOW_CHANNEL, {
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
