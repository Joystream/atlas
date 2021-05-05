import { useQueryNodeStateSubscription } from '@/api/hooks'
import { ExtensionSignCancelledError, ExtrinsicStatus } from '@/joystream-lib'
import { useState, useEffect } from 'react'
import { useSnackbar, useJoystream } from '@/hooks'

export const useDeleteVideo = (memberId: string | null) => {
  const { joystream } = useJoystream()
  const [videoIdToDelete, setVideoIdToDelete] = useState<string | null>(null)
  const [deleteTransactionStatus, setDeleteTransactionStatus] = useState<ExtrinsicStatus | null>(null)
  const [deleteTransactionBlock, setDeleteTransactionBlock] = useState<number | null>(null)
  const { queryNodeState } = useQueryNodeStateSubscription({
    skip: deleteTransactionStatus !== ExtrinsicStatus.Syncing,
  })
  const { displaySnackbar } = useSnackbar()

  useEffect(() => {
    if (!deleteTransactionBlock || !queryNodeState || deleteTransactionStatus !== ExtrinsicStatus.Syncing) {
      return
    }

    if (queryNodeState.indexerHead >= deleteTransactionBlock) {
      setDeleteTransactionStatus(ExtrinsicStatus.Completed)
    }
  }, [deleteTransactionBlock, queryNodeState, deleteTransactionStatus])

  const handleCancel = () => {
    setVideoIdToDelete(null)
  }

  const handleDeleteVideoClick = (videoId?: string) => {
    if (!videoId) {
      return
    }
    setVideoIdToDelete(videoId)
  }

  const handleConfirmDeleteVideo = async () => {
    if (!joystream || !memberId || !videoIdToDelete) {
      return
    }

    const videoId = videoIdToDelete

    setVideoIdToDelete(null)
    setDeleteTransactionStatus(ExtrinsicStatus.Unsigned)
    try {
      const { block } = await joystream.deleteVideo(videoId, memberId, (status) => setDeleteTransactionStatus(status))
      setDeleteTransactionBlock(block)
      setDeleteTransactionStatus(ExtrinsicStatus.Syncing)
    } catch (error) {
      if (error instanceof ExtensionSignCancelledError) {
        console.warn('Sign cancelled')
        setDeleteTransactionStatus(null)
        displaySnackbar({ title: 'Transaction signing cancelled', iconType: 'info' })
      } else {
        console.error(error)
        setDeleteTransactionStatus(ExtrinsicStatus.Error)
      }
    }
  }

  const handleDeleteTransactionClose = () => {
    if (deleteTransactionStatus === ExtrinsicStatus.Completed) {
      setDeleteTransactionStatus(null)
    }
    setDeleteTransactionStatus(null)
  }

  return {
    handleConfirmDeleteVideo,
    handleDeleteTransactionClose,
    handleCancel,
    handleDeleteVideoClick,
    videoIdToDelete,
    deleteTransactionStatus,
  }
}
