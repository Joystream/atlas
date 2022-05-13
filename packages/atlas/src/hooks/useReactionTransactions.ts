import { useApolloClient } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GetCommentsDocument, GetCommentsQueryHookResult, GetVideoDocument } from '@/api/queries'
import { ReactionId } from '@/config/reactions'
import { VideoReaction } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

export const useReactionTransactions = () => {
  const { activeMemberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const [commentInputProcessing, setCommentInputProcessing] = useState(false)
  const [videoReactionProcessing, setVideoReactionProcessing] = useState(false)

  const handleTransaction = useTransaction()
  const [processingCommentReactionId, setProcessingCommentReactionId] = useState<string | null>(null)

  const client = useApolloClient()

  const refetchComments = useCallback(
    () =>
      client.refetchQueries({
        include: [GetCommentsDocument],
      }),
    [client]
  )

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
          await refetchComments()
          setProcessingCommentReactionId(null)
        },
        onError: () => {
          setProcessingCommentReactionId(null)
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchComments]
  )

  const addComment = useCallback(
    async (videoId: string, commentBody: string, parentCommentId?: string) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }
      setCommentInputProcessing(true)

      let newCommentId: string | undefined

      await handleTransaction({
        txFactory: async (updateStatus) =>
          (
            await joystream.extrinsics
          ).createVideoComment(
            activeMemberId,
            videoId,
            commentBody,
            parentCommentId || null,
            proxyCallback(updateStatus)
          ),
        onTxSync: async ({ block }) => {
          const refetchResult = await refetchComments()
          setCommentInputProcessing(false)

          const newCommentsQueryResult = refetchResult[0] as GetCommentsQueryHookResult
          // TODO - We probably shouldn't use inBlock here - it's possible that we could create multiple comments in one block
          // Update once https://github.com/Joystream/atlas/issues/2629 is done.
          newCommentId = newCommentsQueryResult.data?.comments.find(
            (comment) => comment.commentcreatedeventcomment?.[0].inBlock === block
          )?.id
        },
        onError: () => {
          setCommentInputProcessing(false)
        },
        minimized: {
          signErrorMessage: 'Failed to post video comment',
        },
      })

      return newCommentId
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchComments]
  )

  const deleteComment = useCallback(
    async (commentId: string, videoTitle?: string) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).deleteVideoComment(activeMemberId, commentId, proxyCallback(updateStatus)),
        onTxSync: async () => {
          await refetchComments()
        },
        snackbarSuccessMessage: {
          title: 'Comment deleted',
          description: `Your comment to the video ${videoTitle} has been deleted`,
        },
        minimized: {
          signErrorMessage: 'Failed to delete comment',
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchComments]
  )

  const moderateComment = useCallback(
    async (commentId: string, channelId: string, commentAuthorHandle?: string, videoTitle?: string) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).moderateComment(
            activeMemberId,
            channelId,
            commentId,
            proxyCallback(updateStatus)
          ),
        onTxSync: async () => {
          await refetchComments()
        },
        snackbarSuccessMessage: {
          title: 'Comment deleted',
          description: `${commentAuthorHandle}'s comment to your video ${videoTitle} has been deleted`,
        },
        minimized: {
          signErrorMessage: 'Failed to delete comment',
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchComments]
  )

  const refetchVideo = useCallback(
    () =>
      client.refetchQueries({
        include: [GetVideoDocument],
      }),
    [client]
  )

  const likeOrDislikeVideo = useCallback(
    (videoId: string, reaction: VideoReaction) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('No joystream instance')
        return
      }

      setVideoReactionProcessing(true)

      handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).reactToVideo(activeMemberId, videoId, reaction, proxyCallback(updateStatus)),
        minimized: {
          signErrorMessage: 'Failed to react to video',
        },
        onTxSync: async () => {
          await refetchVideo()
          setVideoReactionProcessing(false)
        },
        onError: async () => {
          setVideoReactionProcessing(false)
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchVideo]
  )

  return {
    reactToComment,
    addComment,
    deleteComment,
    moderateComment,
    likeOrDislikeVideo,
    videoReactionProcessing,
    commentInputProcessing,
    processingCommentReactionId,
  }
}
