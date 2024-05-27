import { gql, useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { VideoReaction } from '@/joystream-lib/types'

type AddReactionActionParams = {
  memberId: string
  type: VideoReaction
  videoId: string
}

type RemoveReactionActionParams = {
  reactionId: string
  videoId: string
}

export const useOptimisticActions = () => {
  const client = useApolloClient()

  const addVideoReaction = useCallback(
    ({ memberId, type, videoId }: AddReactionActionParams) => {
      const reactionId = Date.now()
      const recordId = `${reactionId}-${videoId}`
      client.cache.writeFragment({
        id: `VideoReaction:${recordId}`,
        fragment: gql`
          fragment VideoReaction on VideoReaction {
            id
            createdAt
            reaction
            member {
              __ref
            }
          }
        `,
        data: {
          __typename: 'VideoReaction',
          id: recordId,
          createdAt: new Date().toISOString(),
          reaction: type === 'like' ? 'LIKE' : 'UNLIKE',
          member: {
            __ref: `Membership:${memberId}`,
          },
        },
      })
      client.cache.modify({
        id: client.cache.identify({
          __typename: 'Video',
          id: videoId,
        }),
        fields: {
          reactionsCount: (prev) => prev + 1,
          reactions: (prev) => [...prev, { __ref: `VideoReaction:${recordId}` }],
        },
      })
    },
    [client.cache]
  )

  const removeVideoReaction = useCallback(
    ({ reactionId, videoId }: RemoveReactionActionParams) => {
      client.cache.evict({ id: `VideoReaction:${reactionId}` })
      client.cache.modify({
        id: client.cache.identify({
          __typename: 'Video',
          id: videoId,
        }),
        fields: {
          reactionsCount: (prev) => prev - 1,
          reactions: (prev) =>
            (prev ?? []).filter((record: { __ref: string }) => record.__ref !== `VideoReaction:${reactionId}`),
        },
      })
    },
    [client.cache]
  )

  return {
    addVideoReaction,
    removeVideoReaction,
  }
}
