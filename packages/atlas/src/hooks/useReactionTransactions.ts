import { QueryResult } from '@apollo/client'
import { useState } from 'react'

import { ReactionId } from '@/components/_comments/ReactionChip'
import { VideoReaction } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

import { useDisplaySignInDialog } from './useDisplaySignInDialog'

export const useReactionTransactions = (refetch: QueryResult['refetch']) => {
  const { activeMemberId, activeAccountId, signIn } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { openSignInDialog } = useDisplaySignInDialog()
  const [processingCommentReactionId, setProcessingCommentReactionId] = useState<string | null>(null)
  const [videoReactionProcessing, setVideoReactionProcessing] = useState(false)

  const authorized = activeMemberId && activeAccountId

  const handleReactToComment = (commentId: string, reactionId: ReactionId, reactionPopoverDismissed?: boolean) => {
    if (!joystream) {
      ConsoleLogger.error('No joystream instance')
      return
    }
    if (!authorized) {
      openSignInDialog({ onConfirm: signIn })
      return
    }
    if (!reactionPopoverDismissed) {
      return
    }

    setProcessingCommentReactionId(commentId + `-` + reactionId.toString())

    handleTransaction({
      preProcess: () => setProcessingCommentReactionId(commentId + `-` + reactionId.toString()),
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
  }

  const handleLikeAndDislike = (videoId: string, reaction: VideoReaction) => {
    if (!joystream || !activeMemberId) {
      return
    }

    handleTransaction({
      preProcess: () => setVideoReactionProcessing(true),
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).reactToVideo(activeMemberId, videoId, reaction, proxyCallback(updateStatus)),
      minimized: {
        signErrorMessage: 'Failed to react to video',
      },
      onTxSync: async () => {
        await refetch()
        setVideoReactionProcessing(false)
      },
      onError: async () => {
        setVideoReactionProcessing(false)
      },
    })
  }

  return {
    handleLikeAndDislike,
    handleReactToComment,
    processingCommentReactionId,
    videoReactionProcessing,
  }
}
