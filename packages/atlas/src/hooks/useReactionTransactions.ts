import BN from 'bn.js'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { absoluteRoutes } from '@/config/routes'
import { CommentReaction, VideoReaction } from '@/joystream-lib/types'
import { useJoystream } from '@/providers/joystream'
import { useNetworkUtils } from '@/providers/networkUtils/networkUtils.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { TipDetails, UNCONFIRMED, useOptimisticActions } from './useOptimisticActions'

export const useReactionTransactions = () => {
  const { memberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const { refetchReactions, refetchComment, refetchCommentsSection, refetchReplies, refetchVideo, refetchEdits } =
    useNetworkUtils()
  const handleTransaction = useTransaction()
  const {
    addVideoReaction,
    deleteVideoComment,
    removeVideoReaction,
    addVideoComment,
    addVideoReplyComment,
    editVideoComment,
    increaseVideoCommentReaction,
    decreaseVideoCommentReaction,
  } = useOptimisticActions()
  const navigate = useNavigate()
  const { displaySnackbar } = useSnackbar()

  const addComment = useCallback(
    async ({
      parentCommentId,
      videoId,
      commentBody,
      videoTitle,
      commentAuthorHandle,
      optimisticOpts,
      tip,
    }: {
      parentCommentId?: string
      videoId: string
      commentBody: string
      videoTitle?: string | null
      commentAuthorHandle?: string
      optimisticOpts?: { onTxSign: (newCommentId: string) => void }
      tip?: TipDetails
    }) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      let newCommentId = '' // this should be always populated in onTxSync

      const refetch = async () => {
        if (parentCommentId) {
          await Promise.all([
            refetchComment(parentCommentId), // need to refetch parent as its replyCount will change
            refetchReplies(parentCommentId),
            refetchVideo(videoId),
          ])
        } else {
          // if the comment was top-level, refetch the comments section query (will take care of separating user comments)
          await Promise.all([refetchCommentsSection(videoId, memberId), refetchVideo(videoId)])
        }
      }

      await handleTransaction({
        txFactory: async (updateStatus) =>
          (
            await joystream.extrinsics
          ).createVideoComment(
            memberId,
            videoId,
            commentBody,
            parentCommentId || null,
            tip && [tip.dest, tip.amount.toString()],
            proxyCallback(updateStatus)
          ),
        onTxSign: () => {
          if (!optimisticOpts) return

          if (parentCommentId) {
            newCommentId = addVideoReplyComment({
              memberId,
              text: commentBody,
              videoId,
              parentCommentId,
            })
          } else {
            newCommentId = addVideoComment({
              memberId,
              text: commentBody,
              videoId,
              tip,
            })
          }
          optimisticOpts.onTxSign(newCommentId)
        },
        onTxSync: async (_, metaStatus) => {
          if (
            !metaStatus?.__typename ||
            !(metaStatus?.__typename === 'MetaprotocolTransactionResultCommentCreated' && metaStatus.commentCreated?.id)
          ) {
            SentryLogger.error('No comment created found in metaprotocol status event', 'useReactionTransactions')
            return
          }
          newCommentId = metaStatus.commentCreated?.id
          await refetch()
        },
        onError: refetch,
        minimized: {
          errorMessage: parentCommentId
            ? `Your reply to the comment from "${commentAuthorHandle}" was not posted.`
            : `Your comment to the video "${videoTitle}" has not been posted.`,
        },
        unsignedMessage: parentCommentId ? 'To leave your reply' : 'To leave your comment',
        allowMultiple: true,
      })

      return newCommentId
    },
    [
      joystream,
      memberId,
      handleTransaction,
      proxyCallback,
      addVideoReplyComment,
      addVideoComment,
      refetchComment,
      refetchReplies,
      refetchVideo,
      refetchCommentsSection,
    ]
  )

  const reactToComment = useCallback(
    async (
      commentId: string,
      videoId: string,
      reactionId: CommentReaction,
      commentAuthorHandle: string,
      fee?: BN,
      optimisticOpts?: {
        prevReactionServerId?: string
        videoId: string
        onTxSign: () => void
        onUnconfirmedComment: () => void
      }
    ) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('No joystream instance')
        return
      }

      if (commentId.includes(UNCONFIRMED)) {
        displaySnackbar({
          iconType: 'error',
          title: 'Ups, something went wrong',
          description:
            'Looks like this comment is not yet confirmed by a server. Retry shortly, if the problem persists refresh the page.',
        })
        return
      }

      return handleTransaction({
        fee,
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).reactToVideoComment(
            memberId,
            commentId,
            reactionId,
            proxyCallback(updateStatus)
          ),
        onTxSign: () => {
          if (!optimisticOpts) return
          optimisticOpts.onTxSign?.()
          if (optimisticOpts.prevReactionServerId) {
            decreaseVideoCommentReaction({
              commentId,
              reactionId,
              reactionDbId: optimisticOpts.prevReactionServerId,
              videoId: optimisticOpts.videoId,
            })
          } else {
            increaseVideoCommentReaction({ commentId, reactionId, videoId: optimisticOpts.videoId })
          }
        },
        minimized: {
          errorMessage: `Your reaction to the comment from "${commentAuthorHandle}" has not been posted.`,
        },
        allowMultiple: true,
        onError: async () => refetchReactions(videoId),
        unsignedMessage: 'To add your reaction',
      })
    },
    [
      joystream,
      memberId,
      handleTransaction,
      displaySnackbar,
      proxyCallback,
      decreaseVideoCommentReaction,
      increaseVideoCommentReaction,
      refetchReactions,
    ]
  )

  const updateComment = useCallback(
    async ({
      commentId,
      videoId,
      commentBody,
      videoTitle,
      optimisticOpts,
    }: {
      commentId: string
      videoId: string
      commentBody: string
      videoTitle?: string | null
      optimisticOpts?: { onTxSign: () => void; onUnconfirmed: () => void }
    }) => {
      if (!joystream || !memberId || !videoId) {
        ConsoleLogger.error('no joystream or active member')
        return false
      }

      if (commentId.includes(UNCONFIRMED)) {
        displaySnackbar({
          title: "Couldn't edit your comment",
          description: 'Looks like you comment was not yet confirmed by server. Please retry shortly.',
        })
        optimisticOpts?.onUnconfirmed()
        return
      }

      return await handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).editVideoComment(memberId, commentId, commentBody, proxyCallback(updateStatus)),
        onTxSign: () => {
          if (!optimisticOpts) return

          editVideoComment({ commentId, text: commentBody })
          optimisticOpts.onTxSign()
        },
        onTxSync: async () => refetchEdits(commentId),
        minimized: {
          errorMessage: `Your comment to the video "${videoTitle}" has not been edited.`,
        },
        unsignedMessage: 'To edit your comment',
        allowMultiple: true,
      })
    },
    [joystream, memberId, handleTransaction, displaySnackbar, proxyCallback, editVideoComment, refetchEdits]
  )

  const deleteComment = useCallback(
    async (
      commentId: string,
      videoTitle?: string,
      videoId?: string,
      optimisticOpts?: {
        onUnconfirmed: () => void
        onTxSign: () => void
      }
    ) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      if (commentId.includes(UNCONFIRMED)) {
        displaySnackbar({
          title: "Couldn't delete your comment",
          description: 'Looks like you comment was not yet confirmed by server. Please retry shortly.',
        })
        optimisticOpts?.onUnconfirmed()
        return
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).deleteVideoComment(memberId, commentId, proxyCallback(updateStatus)),
        onTxSign: () => {
          if (!optimisticOpts) return

          deleteVideoComment({ commentId })
          optimisticOpts.onTxSign()
        },
        onTxSync: async () => {
          refetchComment(commentId)
        },
        snackbarSuccessMessage: {
          title: 'Comment deleted',
          description: 'Your comment has been deleted.',
          actionText: 'Go to video',
          onActionClick: () => navigate(absoluteRoutes.viewer.video(videoId)),
        },
        minimized: {
          errorMessage: `Your comment to the video "${videoTitle}" has not been deleted.`,
        },
        unsignedMessage: 'To delete your comment',
        allowMultiple: true,
      })
    },
    [
      joystream,
      memberId,
      handleTransaction,
      displaySnackbar,
      proxyCallback,
      deleteVideoComment,
      refetchComment,
      navigate,
    ]
  )

  const moderateComment = useCallback(
    async (commentId: string, channelId: string, commentAuthorHandle?: string, videoId?: string) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).moderateComment(channelId, commentId, proxyCallback(updateStatus)),
        snackbarSuccessMessage: {
          title: 'Comment deleted',
          description: `Comment from "${commentAuthorHandle}" to your video has been deleted.`,
          actionText: 'Go to video',
          onActionClick: () => navigate(absoluteRoutes.viewer.video(videoId)),
        },
        minimized: {
          errorMessage: `Comment from "${commentAuthorHandle}" to your video has not been deleted.`,
        },
        unsignedMessage: `To delete comment from "${commentAuthorHandle}"`,
        allowMultiple: true,
      })
    },
    [memberId, handleTransaction, joystream, navigate, proxyCallback]
  )

  const likeOrDislikeVideo = useCallback(
    (
      videoId: string,
      reaction: VideoReaction,
      videoTitle?: string | null,
      fee?: BN,
      optimisticOpts?: { prevReactionId?: string; onTxSign: () => void; isRemovingReaction: boolean }
    ) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('No joystream instance')
        return Promise.reject(false)
      }

      return handleTransaction({
        fee,
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).reactToVideo(memberId, videoId, reaction, proxyCallback(updateStatus)),
        minimized: {
          errorMessage: `Reaction to the video "${videoTitle || ''}" was not posted.`,
        },
        onTxSign: () => {
          if (!optimisticOpts) return

          optimisticOpts.onTxSign()
          if (optimisticOpts.prevReactionId) {
            removeVideoReaction({ reactionId: optimisticOpts.prevReactionId, videoId })
          }
          if (!optimisticOpts.isRemovingReaction) {
            addVideoReaction({ memberId, type: reaction, videoId })
          }
        },
        unsignedMessage: 'To add your reaction',
        allowMultiple: true,
      })
    },
    [joystream, memberId, handleTransaction, proxyCallback, addVideoReaction, removeVideoReaction]
  )

  return {
    addComment,
    reactToComment,
    deleteComment,
    moderateComment,
    updateComment,
    likeOrDislikeVideo,
  }
}
