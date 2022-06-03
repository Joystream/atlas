import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

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
  GetUserCommentsAndVideoCommentsConnectionDocument,
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQueryVariables,
  GetUserCommentsReactionsDocument,
  GetUserCommentsReactionsQuery,
  GetUserCommentsReactionsQueryVariables,
  GetVideoDocument,
  GetVideoQuery,
  GetVideoQueryVariables,
} from '@/api/queries'
import { ReactionId } from '@/config/reactions'
import { VideoReaction } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

export const useReactionTransactions = () => {
  const { activeMemberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
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
          memberId: activeMemberId || '',
          videoId: videoId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [activeMemberId, client]
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
          memberId: activeMemberId,
          videoId: videoId,
        },
        fetchPolicy: 'network-only',
      })
    },
    [activeMemberId, client]
  )

  const addComment = useCallback(
    async ({
      parentCommentId,
      videoId,
      commentBody,
    }: {
      parentCommentId?: string
      videoId: string
      commentBody: string
    }) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('no joystream or active member')
        return
      }

      let newCommentId = '' // this should be always populated in onTxSync

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
            ])
          } else {
            // if the comment was top-level, refetch the comments section query (will take care of separating user comments)
            await refetchCommentsSection(videoId)
          }
        },
        minimized: {
          signErrorMessage: 'Failed to post video comment',
        },
      })

      return newCommentId
    },
    [
      activeMemberId,
      handleTransaction,
      joystream,
      proxyCallback,
      refetchComment,
      refetchCommentsSection,
      refetchReplies,
    ]
  )

  const reactToComment = useCallback(
    async (commentId: string, videoId: string, reactionId: ReactionId) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('No joystream instance')
        return
      }

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
        onTxSync: async () => Promise.all([refetchComment(commentId), refetchReactions(videoId)]),
        onError: async () => refetchReactions(videoId),
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchComment, refetchReactions]
  )

  const updateComment = useCallback(
    async ({ commentId, videoId, commentBody }: { commentId: string; videoId: string; commentBody: string }) => {
      if (!joystream || !activeMemberId || !videoId) {
        ConsoleLogger.error('no joystream or active member')
        return false
      }

      return await handleTransaction({
        txFactory: async (updateStatus) =>
          (
            await joystream.extrinsics
          ).editVideoComment(activeMemberId, commentId, commentBody, proxyCallback(updateStatus)),
        onTxSync: async () => refetchEdits(commentId),
        minimized: {
          signErrorMessage: 'Failed to udpate video comment',
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchEdits]
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
        snackbarSuccessMessage: {
          title: 'Comment deleted',
          description: `Your comment to the video ${videoTitle} has been deleted`,
        },
        minimized: {
          signErrorMessage: 'Failed to delete comment',
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback]
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
        snackbarSuccessMessage: {
          title: 'Comment deleted',
          description: `${commentAuthorHandle}'s comment to your video ${videoTitle} has been deleted`,
        },
        minimized: {
          signErrorMessage: 'Failed to delete comment',
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback]
  )

  const refetchVideo = useCallback(
    (id: string) =>
      client.query<GetVideoQuery, GetVideoQueryVariables>({
        query: GetVideoDocument,
        variables: {
          where: {
            id,
          },
        },
        fetchPolicy: 'network-only',
      }),
    [client]
  )

  const likeOrDislikeVideo = useCallback(
    (videoId: string, reaction: VideoReaction) => {
      if (!joystream || !activeMemberId) {
        ConsoleLogger.error('No joystream instance')
        return Promise.reject(false)
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).reactToVideo(activeMemberId, videoId, reaction, proxyCallback(updateStatus)),
        minimized: {
          signErrorMessage: 'Failed to react to video',
        },
        onTxSync: async () => {
          await refetchVideo(videoId)
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchVideo]
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
