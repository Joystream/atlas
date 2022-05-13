import { useApolloClient } from '@apollo/client'
import { useCallback, useState } from 'react'

import {
  GetCommentsDocument,
  GetUserCommentsAndVideoCommentsConnectionDocument,
  GetUserCommentsAndVideoCommentsConnectionQueryHookResult,
  GetVideoDocument,
} from '@/api/queries'
import { ReactionId } from '@/config/reactions'
import { VideoReaction } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

export const useReactionTransactions = () => {
  const { activeMemberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  // stores the isProcessing state of comment inputs and is indexed by commentId's
  const [commentInputIsProcessingCollection, setCommentInputIsProcessingCollection] = useState(new Set<string>())
  const setCommentInputIsProcessing = ({ commentInputId, value }: { commentInputId: string; value: boolean }) => {
    setCommentInputIsProcessingCollection((processing) => {
      if (value) {
        processing.add(commentInputId)
      } else {
        processing.delete(commentInputId)
      }
      return new Set(processing)
    })
  }

  const [videoReactionProcessing, setVideoReactionProcessing] = useState(false)

  const handleTransaction = useTransaction()
  const [processingCommentReactionId, setProcessingCommentReactionId] = useState<string | null>(null)

  const client = useApolloClient()

  const refetchComments = useCallback(
    (): Promise<GetUserCommentsAndVideoCommentsConnectionQueryHookResult[]> =>
      client.refetchQueries({
        include: [GetUserCommentsAndVideoCommentsConnectionDocument, GetCommentsDocument],
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
    async ({
      commentInputId,
      parentCommentId,
      videoId,
      commentBody,
    }: {
      commentInputId: string
      parentCommentId?: string
      videoId: string
      commentBody: string
    }) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }
      setCommentInputIsProcessing({ commentInputId, value: true })

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
          setCommentInputIsProcessing({ commentInputId, value: false })

          const newCommentsQueryResult = refetchResult[0]
          // TODO - We probably shouldn't use inBlock here - it's possible that we could create multiple comments in one block
          // Update once https://github.com/Joystream/atlas/issues/2629 is done.
          newCommentId = newCommentsQueryResult.data?.videoCommentsConnection.edges.find(
            (edge) => edge.node.commentcreatedeventcomment?.[0].inBlock === block
          )?.node.id
        },
        onError: () => {
          setCommentInputIsProcessing({ commentInputId, value: false })
        },
        minimized: {
          signErrorMessage: 'Failed to post video comment',
        },
      })
      return newCommentId
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchComments]
  )

  const updateComment = useCallback(
    async ({ commentId, videoId, commentBody }: { commentId: string; videoId: string; commentBody: string }) => {
      if (!joystream || !activeMemberId || !videoId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }
      setCommentInputIsProcessing({ commentInputId: commentId, value: true })

      await handleTransaction({
        txFactory: async (updateStatus) =>
          (
            await joystream.extrinsics
          ).editVideoComment(activeMemberId, commentId, commentBody, proxyCallback(updateStatus)),
        onTxSync: async () => {
          await refetchComments()
          setCommentInputIsProcessing({ commentInputId: commentId, value: false })
        },
        onError: () => {
          setCommentInputIsProcessing({ commentInputId: commentId, value: false })
        },
        minimized: {
          signErrorMessage: 'Failed to udpate video comment',
        },
      })
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
    updateComment,
    likeOrDislikeVideo,
    videoReactionProcessing,
    commentInputIsProcessingCollection,
    processingCommentReactionId,
  }
}
