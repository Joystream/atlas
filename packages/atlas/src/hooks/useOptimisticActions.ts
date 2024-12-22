import { ApolloCache, DocumentNode, gql, useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { FragmentDefinitionNode, Kind } from 'graphql'
import { useCallback } from 'react'

import { CommentEdge, CommentStatus, CommentTipTier } from '@/api/queries/__generated__/baseTypes.generated'
import {
  BasicMembershipFieldsFragmentDoc,
  CommentFieldsFragment,
  CommentFieldsFragmentDoc,
} from '@/api/queries/__generated__/fragments.generated'
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

export type TipDetails = {
  amount: BN
  tier: CommentTipTier
  dest: string
}

type AddCommentActionParams = {
  memberId: string
  videoId: string
  parentCommentId: string
  text: string
  tip?: TipDetails
}

type AtlasCacheType = ApolloCache<{
  'ROOT_QUERY': Record<string, unknown>
}>

const findCommentCacheKey = (cache: AtlasCacheType, videoId: string) => {
  const cacheKeys = Object.keys(cache.extract()['ROOT_QUERY'])
  return cacheKeys.find((key) => key.includes('comments') && key.includes(`id-${videoId}-`))
}

const findParentCacheKey = (cache: AtlasCacheType, parentId: string) => {
  const cacheKeys = Object.keys(cache.extract()['ROOT_QUERY'])
  return cacheKeys.find((key) => key.includes('comments') && key.includes(`parentId-${parentId}-`))
}

const findCommentReactionQuery = (cache: AtlasCacheType, videoId: string) => {
  const cacheKeys = Object.keys(cache.extract()['ROOT_QUERY'])
  return cacheKeys.find((key) => key.includes('commentReactions') && key.includes(`videoId-${videoId}-`))
}

const fragmentName = (d: DocumentNode): string | undefined => {
  return d.definitions.find((d): d is FragmentDefinitionNode => d.kind === Kind.FRAGMENT_DEFINITION)?.name.value
}

export const UNCONFIRMED = 'UNCONFIRMED'
export const UNCONFIRMED_COMMENT = `${UNCONFIRMED}-COMMENT`
export const UNCONFIRMED_REACTION = `${UNCONFIRMED}-REACTION`

const reactionFragment = gql`
  fragment CommentReactionFields on CommentReaction {
    id
    reactionId
    comment {
      __ref
    }
  }
`

export const useOptimisticActions = () => {
  const client = useApolloClient()

  const increaseVideoCommentReaction = useCallback(
    ({ commentId, reactionId, videoId }: { commentId: string; reactionId: number; videoId: string }) => {
      client.cache.modify({
        id: `Comment:${commentId}`,
        fields: {
          reactionsCountByReactionId: (_prev) => {
            const prev = _prev ?? []
            const reactionPosition = prev.findIndex(
              (reactionEntry: { reactionId: number; count: number }) => reactionEntry.reactionId === reactionId
            )
            const reaction =
              reactionPosition === -1
                ? { __typename: 'CommentReactionsCountByReactionId', reactionId, count: 0 }
                : prev[reactionPosition]
            const newPrev = [...prev]
            newPrev[reactionPosition === -1 ? prev.length : reactionPosition] = {
              ...reaction,
              count: 1 + (reaction?.count ?? 0),
            }

            return newPrev
          },
        },
      })

      const recordId = `${commentId}-${videoId}-${UNCONFIRMED_REACTION}-${Date.now()}`

      client.cache.writeFragment({
        id: `CommentReaction:${recordId}`,
        fragment: reactionFragment,
        data: {
          __typename: 'CommentReaction',
          id: recordId,
          comment: {
            __ref: `Comment:${commentId}`,
          },
          reactionId,
        },
      })

      const videoReactionQueryKey = findCommentReactionQuery(client.cache as AtlasCacheType, videoId)
      if (videoReactionQueryKey) {
        client.cache.modify({
          optimistic: true,
          id: 'ROOT_QUERY',
          fields: {
            [videoReactionQueryKey]: (existingResults = []) => {
              return [...(existingResults as []), { __ref: `CommentReaction:${recordId}` }]
            },
          },
        })
      }

      return recordId
    },
    [client.cache]
  )

  const decreaseVideoCommentReaction = useCallback(
    ({
      commentId,
      reactionId,
      reactionDbId,
      videoId,
    }: {
      commentId: string
      reactionId: number
      reactionDbId: string
      videoId: string
    }) => {
      client.cache.modify({
        id: `Comment:${commentId}`,
        fields: {
          reactionsCountByReactionId: (prev) => {
            const reactionPosition = prev.findIndex(
              (reactionEntry: { reactionId: number; count: number }) => reactionEntry.reactionId === reactionId
            )
            const reaction = prev[reactionPosition]
            const newPrev = [...prev]
            newPrev[reactionPosition] = {
              ...reaction,
              count: reaction?.count ? reaction.count - 1 : 0,
            }
            return newPrev
          },
        },
      })

      client.cache.evict({
        id: `CommentReaction:${reactionDbId}`,
      })

      const videoReactionQueryKey = findCommentReactionQuery(client.cache as AtlasCacheType, videoId)
      if (videoReactionQueryKey) {
        client.cache.modify({
          optimistic: true,
          id: 'ROOT_QUERY',
          fields: {
            [videoReactionQueryKey]: (existingResults = []) => {
              const index = (existingResults as { __ref: string }[]).findIndex(
                (res) => res.__ref === `CommentReaction:${reactionDbId}`
              )
              const newRes = [...(existingResults as [])]
              if (index) newRes[index] = { __ref: 'empty' } as never
              return newRes as unknown
            },
          },
        })
      }
    },
    [client.cache]
  )

  const evictUnconfirmedReaction = useCallback(
    (id: string) => {
      if (id.includes(UNCONFIRMED_REACTION)) {
        client.cache.evict({ id: `CommentReaction:${id}` })
      }
    },
    [client.cache]
  )

  const deleteVideoComment = useCallback(
    ({ commentId }: { commentId: string }) => {
      client.cache.modify({
        id: `Comment:${commentId}`,
        fields: {
          status: () => 'DELETED',
        },
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

  /**
   * cached commentsConnection query results need to be updated manually to include unconfirmed comments
   * (contrary to `comments` query results which get updated automatically when a new entity is added)
   */
  const refreshCommentsCache = useCallback(
    (videoId: string, parentCommentId?: string) => {
      const unconfirmedCommentIds = Object.keys(client.cache.extract()).filter((k) => k.includes(UNCONFIRMED_COMMENT))
      const queryCacheKey = parentCommentId
        ? findParentCacheKey(client.cache as AtlasCacheType, parentCommentId)
        : findCommentCacheKey(client.cache as AtlasCacheType, videoId)

      if (queryCacheKey) {
        let addedUnconfirmedComments = 0
        client.cache.modify({
          optimistic: true,
          id: 'ROOT_QUERY',
          fields: {
            [queryCacheKey]: (existingConnection = {}) => {
              const existingEdges: (CommentEdge | { node: { __ref: string } })[] = existingConnection.edges || []
              const unconfirmedEdges = unconfirmedCommentIds
                .filter((unconfirmedId) => {
                  const recordId = unconfirmedId.split(':')[1]
                  return !existingEdges.find((e) =>
                    '__ref' in e.node ? e.node.__ref === unconfirmedId : e.node.id === recordId
                  )
                })
                .filter(
                  (unconfirmedId) =>
                    unconfirmedId.split('/')[1] === videoId &&
                    unconfirmedId.split('/')[2] === (parentCommentId || 'none')
                )
                .map((unconfirmedId) => ({
                  __typename: 'CommentEdge',
                  cursor: '0',
                  node: {
                    __ref: unconfirmedId,
                  },
                }))
              addedUnconfirmedComments = unconfirmedEdges.length
              return {
                ...existingConnection,
                edges: [...existingEdges, ...unconfirmedEdges],
              }
            },
          },
        })

        if (parentCommentId) {
          client.cache.modify({
            optimistic: true,
            id: `Comment:${parentCommentId}`,
            fields: {
              repliesCount: (prevCount) => prevCount + addedUnconfirmedComments,
            },
          })
        }
      }
    },
    [client.cache]
  )

  const addVideoComment = useCallback(
    ({
      memberId,
      videoId,
      parentCommentId,
      text,
      tip,
    }: Omit<AddCommentActionParams, 'parentCommentId'> & { parentCommentId?: string }) => {
      const commentId = Date.now()
      const recordId = `${commentId}/${videoId}/${parentCommentId || 'none'}/${UNCONFIRMED_COMMENT}`
      client.cache.writeFragment<CommentFieldsFragment>({
        id: `Comment:${recordId}`,
        fragment: CommentFieldsFragmentDoc,
        fragmentName: fragmentName(CommentFieldsFragmentDoc),
        data: {
          __typename: 'Comment',
          id: recordId,
          isExcluded: false,
          author: client.cache.readFragment({
            id: `Membership:${memberId}`,
            fragment: BasicMembershipFieldsFragmentDoc,
            fragmentName: fragmentName(BasicMembershipFieldsFragmentDoc),
          })!,
          createdAt: new Date(),
          isEdited: false,
          reactionsCountByReactionId: null,
          parentComment: parentCommentId
            ? {
                __typename: 'Comment',
                id: parentCommentId,
              }
            : null,
          repliesCount: 0,
          text: text,
          status: CommentStatus.Visible,
          tipAmount: tip?.amount.toString() || '0',
          tipTier: tip?.tier || null,
        },
      })

      refreshCommentsCache(videoId, parentCommentId)

      return recordId
    },
    [client.cache, refreshCommentsCache]
  )

  const evictUnconfirmedComment = useCallback(
    (id: string) => {
      if (id.includes(UNCONFIRMED_COMMENT)) {
        client.cache.evict({ id: `Comment:${id}` })
      }
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
    editVideoComment,
    deleteVideoComment,
    increaseVideoCommentReaction,
    decreaseVideoCommentReaction,
    evictUnconfirmedReaction,
    evictUnconfirmedComment,
    refreshCommentsCache,
  }
}
