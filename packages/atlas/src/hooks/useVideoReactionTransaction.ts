import { useApolloClient } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GetVideoDocument } from '@/api/queries'
import { VideoReaction } from '@/joystream-lib'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

export const useVideoReactionTransaction = () => {
  const { activeMemberId } = useUser()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const [videoReactionProcessing, setVideoReactionProcessing] = useState(false)

  const client = useApolloClient()

  const refetch = useCallback(
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
          await refetch()
          setVideoReactionProcessing(false)
        },
        onError: async () => {
          setVideoReactionProcessing(false)
        },
      })
    },
    [activeMemberId, handleTransaction, joystream, proxyCallback, refetch]
  )

  return {
    likeOrDislikeVideo,
    videoReactionProcessing,
  }
}
