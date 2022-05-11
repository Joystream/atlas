import { useApolloClient } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'

import { GetCommentsDocument, GetCommentsQueryHookResult } from '@/api/queries'
import { ReactionId } from '@/components/_comments/ReactionChip'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

export const useCommentTransactions = () => {
  const { activeMemberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const [commentInputProcessing, setCommentInputProcessing] = useState(false)
  const [highlightedComment, setHighlightedComment] = useState<string | null>(null)
  const handleTransaction = useTransaction()
  const [processingCommentReactionId, setProcessingCommentReactionId] = useState<string | null>(null)

  const client = useApolloClient()

  const refetch = useCallback(
    () =>
      client.refetchQueries({
        include: [GetCommentsDocument],
      }),
    [client]
  )

  useEffect(() => {
    if (!highlightedComment) {
      return
    }
    const timeout = setTimeout(() => {
      setHighlightedComment(null)
    }, 3000)

    return () => clearTimeout(timeout)
  })

  const reactToComment = useCallback(
    async (commentId: string, reactionId: ReactionId) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('No joystream instance')
        return
      }

      setProcessingCommentReactionId(commentId + `-` + reactionId.toString())

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).reactToVideoComment(
            activeMemberId,
            commentId,
            reactionId,
            proxyCallback(updateStatus)
          ),
        minimized: {
          signErrorMessage: 'Failed to react to comment',
        },
        onTxSync: async () => {
          await refetch()
          setProcessingCommentReactionId(null)
        },
        onError: () => {
          setProcessingCommentReactionId(null)
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetch]
  )

  const addComment = useCallback(
    async (videoId: string, commentBody: string, parentCommentId?: string) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      return handleTransaction({
        preProcess: () => {
          setCommentInputProcessing(true)
        },
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).createVideoComment(
            activeMemberId,
            videoId,
            commentBody,
            parentCommentId || null,
            proxyCallback(updateStatus)
          ),
        onTxSync: async ({ block }) => {
          const refetchResult = await refetch()
          const newCommentsQueryResult = refetchResult[0] as GetCommentsQueryHookResult
          const newCommentId = newCommentsQueryResult.data?.comments.find(
            (comment) => comment.commentcreatedeventcomment?.[0].inBlock === block
          )?.id
          setHighlightedComment(newCommentId || null)
          setCommentInputProcessing(false)
        },
        onError: () => {
          setCommentInputProcessing(false)
        },
        minimized: {
          signErrorMessage: 'Failed to post video comment',
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetch]
  )

  return {
    reactToComment,
    addComment,
    commentInputProcessing,
    highlightedComment,
    processingCommentReactionId,
  }
}
