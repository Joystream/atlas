import { ApolloCache, gql, useApolloClient } from '@apollo/client'
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

type AddCommentActionParams = {
  memberId: string
  videoId: string
  parentCommentId: string
  text: string
}

type AtlasCacheType = ApolloCache<{
  'ROOT_QUERY': Record<string, unknown>
}>

const findCacheKey = (cache: AtlasCacheType, videoId: string) => {
  const cacheKeys = Object.keys(cache.extract()['ROOT_QUERY'])
  return cacheKeys.find((key) => key.includes(`id-${videoId}-`))
}
const findParentCacheKey = (cache: AtlasCacheType, parentId: string) => {
  const cacheKeys = Object.keys(cache.extract()['ROOT_QUERY'])
  return cacheKeys.find((key) => key.includes(`parentId-${parentId}-`))
}
export const UNCONFIRMED = 'UNCONFIRMED'
export const UNCOFIRMED_COMMENT = `${UNCONFIRMED}-COMMENT`
export const UNCOFIRMED_REPLY = `${UNCONFIRMED}-REPLY`

const commentFragment = gql`
  fragment CommentFields on Comment {
    id
    isExcluded
    author {
      __ref
    }
    createdAt
    isEdited
    reactionsCountByReactionId {
      __ref
    }
    parentComment {
      __ref
    }
    repliesCount
    text
    status
  }
`

export const useOptimisticActions = () => {
  const client = useApolloClient()

  const deleteVideoComment = useCallback(
    ({ commentId }: { commentId: string }) => {
      client.cache.evict({
        id: `Comment:${commentId}`,
      })
    },
    [client.cache]
  )

  const editVideoComment = useCallback(
    ({ commentId, text }: { commentId: string; text: string }) => {
      client.cache.modify({
        id: `Comment:${commentId}`,
        fields: {
          text: () => text,
          isEdited: () => true,
        },
      })
    },
    [client.cache]
  )

  const addVideoReplyComment = useCallback(
    ({ memberId, videoId, text, parentCommentId }: AddCommentActionParams) => {
      const commentId = Date.now()
      const recordId = `${commentId}-${videoId}-${UNCOFIRMED_REPLY}`
      client.cache.writeFragment({
        id: `Comment:${recordId}`,
        fragment: commentFragment,
        data: {
          __typename: 'Comment',
          id: recordId,
          isExcluded: false,
          author: {
            __ref: `Membership:${memberId}`,
          },
          createdAt: new Date().toISOString(),
          isEdited: false,
          reactionsCountByReactionId: null,
          repliesCount: 0,
          text: text,
          status: 'VISIBLE',
          parentComment: { __ref: `Comment:${parentCommentId}` },
        },
      })

      const parentQuery = findParentCacheKey(client.cache as AtlasCacheType, parentCommentId)
      if (parentQuery) {
        client.cache.modify({
          optimistic: true,
          id: 'ROOT_QUERY',
          fields: {
            [parentQuery]: (existingCommentsConnection = {}) => {
              const newEdge = {
                __typename: 'CommentEdge',
                cursor: '0',
                node: {
                  __ref: `Comment:${recordId}`,
                },
              }
              return {
                ...existingCommentsConnection,
                edges: [...(existingCommentsConnection.edges ?? []), newEdge],
              }
            },
          },
        })

        client.cache.modify({
          optimistic: true,
          id: `Comment:${parentCommentId}`,
          fields: {
            repliesCount: (prev) => prev + 1,
          },
        })
      }
      return recordId
    },
    [client.cache]
  )

  const addVideoComment = useCallback(
    ({ memberId, videoId, text }: Omit<AddCommentActionParams, 'parentCommentId'>) => {
      const commentId = Date.now()
      const recordId = `${commentId}-${videoId}-${UNCOFIRMED_COMMENT}`
      client.cache.writeFragment({
        id: `Comment:${recordId}`,
        fragment: commentFragment,
        data: {
          __typename: 'Comment',
          id: recordId,
          isExcluded: false,
          author: {
            __ref: `Membership:${memberId}`,
          },
          createdAt: new Date().toISOString(),
          isEdited: false,
          reactionsCountByReactionId: null,
          parentComment: null,
          repliesCount: 0,
          text: text,
          status: 'VISIBLE',
        },
      })

      const queryKey = findCacheKey(client.cache as AtlasCacheType, videoId)
      if (queryKey) {
        client.cache.modify({
          optimistic: true,
          id: 'ROOT_QUERY',
          fields: {
            [queryKey]: (existingCommentsConnection = {}) => {
              const newEdge = {
                __typename: 'CommentEdge',
                cursor: '0', // Generate or use an appropriate cursor value
                node: {
                  __ref: `Comment:${recordId}`,
                },
              }
              return {
                ...existingCommentsConnection,
                edges: [...(existingCommentsConnection.edges ?? []), newEdge],
              }
            },
          },
        })
      }

      return recordId
    },
    [client.cache]
  )

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
    addVideoComment,
    addVideoReplyComment,
    editVideoComment,
    deleteVideoComment,
  }
}
