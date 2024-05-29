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

import { UNCONFIRMED, useOptimisticActions } from './useOptimisticActions'

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
      opts,
    }: {
      parentCommentId?: string
      videoId: string
      commentBody: string
      videoTitle?: string | null
      commentAuthorHandle?: string
      opts?: { onTxSign?: (newCommentId: string) => void }
    }) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      let newCommentId = '' // this should be always populated in onTxSync

      await handleTransaction({
        txFactory: async (updateStatus) =>
          (
            await joystream.extrinsics
          ).createVideoComment(memberId, videoId, commentBody, parentCommentId || null, proxyCallback(updateStatus)),
        onTxSign: () => {
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
            })
          }
          opts?.onTxSign?.(newCommentId)
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
        },
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
    async (commentId: string, videoId: string, reactionId: CommentReaction, commentAuthorHandle: string, fee?: BN) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('No joystream instance')
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
        minimized: {
          errorMessage: `Your reaction to the comment from "${commentAuthorHandle}" has not been posted.`,
        },
        allowMultiple: true,
        onTxSync: async () => Promise.all([refetchComment(commentId), refetchReactions(videoId)]),
        onError: async () => refetchReactions(videoId),
        unsignedMessage: 'To add your reaction',
      })
    },
    [memberId, handleTransaction, joystream, proxyCallback, refetchComment, refetchReactions]
  )

  const updateComment = useCallback(
    async ({
      commentId,
      videoId,
      commentBody,
      videoTitle,
      opts,
    }: {
      commentId: string
      videoId: string
      commentBody: string
      videoTitle?: string | null
      opts?: { onTxSign?: () => void; onUnconfirmed: () => void }
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
        opts?.onUnconfirmed()
        return
      }

      return await handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).editVideoComment(memberId, commentId, commentBody, proxyCallback(updateStatus)),
        onTxSign: () => {
          editVideoComment({ commentId, text: commentBody })
          opts?.onTxSign?.()
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
      opts?: {
        onUnconfirmed: () => void
        onTxSign?: () => void
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
        opts?.onUnconfirmed()
        return
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).deleteVideoComment(memberId, commentId, proxyCallback(updateStatus)),
        onTxSign: () => {
          deleteVideoComment({ commentId })
          opts?.onTxSign?.()
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
      opts?: { prevReactionId?: string; onTxSign?: () => void; isRemovingReaction?: boolean }
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
          opts?.onTxSign?.()
          if (opts?.prevReactionId) {
            removeVideoReaction({ reactionId: opts?.prevReactionId, videoId })
          }
          if (!opts?.isRemovingReaction) {
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
