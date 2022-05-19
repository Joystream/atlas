import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

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
  const handleTransaction = useTransaction()

  const client = useApolloClient()

  const refetchComments = useCallback(
    (): Promise<GetUserCommentsAndVideoCommentsConnectionQueryHookResult[]> =>
      client.refetchQueries({
        include: [GetUserCommentsAndVideoCommentsConnectionDocument, GetCommentsDocument],
      }),
    [client]
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
        onTxSync: async ({ transactionHash }) => {
          const refetchResult = await refetchComments()
          const { data } = refetchResult[0]

          newCommentId = data?.videoCommentsConnection.edges.find(
            // TODO We shouldn't fetch additional data from the commentcreatedeventcomment
            // update this once QN supports getting ID directly from the status query
            (edge) => edge.node.commentcreatedeventcomment?.[0].inExtrinsic === transactionHash
          )?.node.id
        },
        minimized: {
          signErrorMessage: 'Failed to post video comment',
        },
      })
      return newCommentId
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchComments]
  )

  const reactToComment = useCallback(
    async (commentId: string, reactionId: ReactionId) => {
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
        onTxSync: async () => {
          await refetchComments()
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetchComments]
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
        onTxSync: async () => {
          await refetchComments()
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
        return Promise.reject(false)
      }

      return handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).reactToVideo(activeMemberId, videoId, reaction, proxyCallback(updateStatus)),
        minimized: {
          signErrorMessage: 'Failed to react to video',
        },
        onTxSync: async () => {
          await refetchVideo()
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
