import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import {
  GetCommentDocument,
  GetCommentEditsDocument,
  GetCommentEditsQuery,
  GetCommentEditsQueryVariables,
  GetCommentQuery,
  GetCommentQueryVariables,
  GetCommentRepliesConnectionDocument,
  GetCommentRepliesConnectionQuery,
  GetCommentRepliesConnectionQueryVariables,
  GetFullVideoDocument,
  GetFullVideoQuery,
  GetFullVideoQueryVariables,
  GetUserCommentsAndVideoCommentsConnectionDocument,
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  GetUserCommentsReactionsDocument,
  GetUserCommentsReactionsQuery,
  GetUserCommentsReactionsQueryVariables,
} from '@/api/queries'
import { ReactionId } from '@/config/reactions'
import { absoluteRoutes } from '@/config/routes'
import { VideoReaction } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { useUser } from '@/providers/user'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

export const useReactionTransactions = () => {
  const { memberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const navigate = useNavigate()
  const client = useApolloClient()

  const refetchComment = useCallback(
    (id: string) => {
      return client.query<GetCommentQuery, GetCommentQueryVariables>({
        query: GetCommentDocument,
        variables: {
          commentId: id,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const refetchEdits = useCallback(
    (id: string) => {
      return client.query<GetCommentEditsQuery, GetCommentEditsQueryVariables>({
        query: GetCommentEditsDocument,
        variables: {
          commentId: id,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const refetchReactions = useCallback(
    (videoId: string) => {
      return client.query<GetUserCommentsReactionsQuery, GetUserCommentsReactionsQueryVariables>({
        query: GetUserCommentsReactionsDocument,
        variables: {
          memberId: memberId || '',
          videoId: videoId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [memberId, client]
  )

  const refetchReplies = useCallback(
    (parentCommentId: string) => {
      return client.query<GetCommentRepliesConnectionQuery, GetCommentRepliesConnectionQueryVariables>({
        query: GetCommentRepliesConnectionDocument,
        variables: {
          parentCommentId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [client]
  )

  const refetchCommentsSection = useCallback(
    (videoId: string) => {
      return client.query<
        GetUserCommentsAndVideoCommentsConnectionQuery,
        GetUserCommentsAndVideoCommentsConnectionQueryVariables
      >({
        query: GetUserCommentsAndVideoCommentsConnectionDocument,
        variables: {
          memberId: memberId,
          videoId: videoId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [memberId, client]
  )

  const refetchVideo = useCallback(
    (id: string) =>
      client.query<GetFullVideoQuery, GetFullVideoQueryVariables>({
        query: GetFullVideoDocument,
        variables: {
          where: {
            id,
          },
        },
        fetchPolicy: 'network-only',
      }),
    [client]
  )

  const addComment = useCallback(
    async ({
      parentCommentId,
      videoId,
      commentBody,
      videoTitle,
      commentAuthorHandle,
    }: {
      parentCommentId?: string
      videoId: string
      commentBody: string
      videoTitle?: string | null
      commentAuthorHandle?: string
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
        onTxSync: async (_, metaStatus) => {
          if (!metaStatus?.commentCreated) {
            SentryLogger.error('No comment created found in metaprotocol status event', 'useReactionTransactions')
            return
          }
          newCommentId = metaStatus.commentCreated.id
          if (parentCommentId) {
            await Promise.all([
              refetchComment(parentCommentId), // need to refetch parent as its replyCount will change
              refetchReplies(parentCommentId),
              refetchVideo(videoId),
            ])
          } else {
            // if the comment was top-level, refetch the comments section query (will take care of separating user comments)
            await Promise.all([refetchCommentsSection(videoId), refetchVideo(videoId)])
          }
        },
        minimized: {
          errorMessage: parentCommentId
            ? `Your reply to the comment from "${commentAuthorHandle}" was not posted.`
            : `Your comment to the video "${videoTitle}" has not been posted.`,
        },
        unsignedMessage: parentCommentId ? 'To leave your reply' : 'To leave your comment',
      })

      return newCommentId
    },
    [
      memberId,
      handleTransaction,
      joystream,
      proxyCallback,
      refetchComment,
      refetchCommentsSection,
      refetchReplies,
      refetchVideo,
    ]
  )

  const reactToComment = useCallback(
    async (commentId: string, videoId: string, reactionId: ReactionId, commentAuthorHandle: string) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('No joystream instance')
        return
      }

      return handleTransaction({
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
    }: {
      commentId: string
      videoId: string
      commentBody: string
      videoTitle?: string | null
    }) => {
      if (!joystream || !memberId || !videoId) {
        ConsoleLogger.error('no joystream or active member')
        return false
      }

      return await handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).editVideoComment(memberId, commentId, commentBody, proxyCallback(updateStatus)),
        onTxSync: async () => refetchEdits(commentId),
        minimized: {
          errorMessage: `Your comment to the video "${videoTitle}" has not been edited.`,
        },
        unsignedMessage: 'To edit your comment',
      })
    },
    [memberId, handleTransaction, joystream, proxyCallback, refetchEdits]
  )
  const deleteComment = useCallback(
    async (commentId: string, videoTitle?: string, videoId?: string) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).deleteVideoComment(memberId, commentId, proxyCallback(updateStatus)),
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
      })
    },
    [memberId, handleTransaction, joystream, navigate, proxyCallback]
  )

  const moderateComment = useCallback(
    async (commentId: string, channelId: string, commentAuthorHandle?: string, videoId?: string) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).moderateComment(memberId, channelId, commentId, proxyCallback(updateStatus)),
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
      })
    },
    [memberId, handleTransaction, joystream, navigate, proxyCallback]
  )

  const likeOrDislikeVideo = useCallback(
    (videoId: string, reaction: VideoReaction, videoTitle?: string | null) => {
      if (!joystream || !memberId) {
        ConsoleLogger.error('No joystream instance')
        return Promise.reject(false)
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).reactToVideo(memberId, videoId, reaction, proxyCallback(updateStatus)),
        minimized: {
          errorMessage: `Reaction to the video "${videoTitle || ''}" was not posted.`,
        },
        onTxSync: async () => {
          await refetchVideo(videoId)
        },
        unsignedMessage: 'To add your reaction',
      })
    },
    [memberId, handleTransaction, joystream, proxyCallback, refetchVideo]
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
