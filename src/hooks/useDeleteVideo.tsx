import { useQueryNodeStateSubscription } from '@/api/hooks'
import { ExtensionSignCancelledError, ExtrinsicStatus } from '@/joystream-lib'
import { useState, useEffect } from 'react'
import { useSnackbar, useJoystream, useAuthorizedUser } from '@/hooks'

export const useDeleteVideo = () => {
  const { joystream } = useJoystream()
  const { activeMemberId } = useAuthorizedUser()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
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

  const confirmDeleteVideo = async (videoId?: string) => {
    if (!joystream || !videoId) {
      return
    }

    setIsDeleteDialogOpen(false)
    setDeleteTransactionStatus(ExtrinsicStatus.Unsigned)
    try {
      const { block } = await joystream.deleteVideo(videoId, activeMemberId, (status) =>
        setDeleteTransactionStatus(status)
      )
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

  return {
    closeVideoDeleteDialog: () => setIsDeleteDialogOpen(false),
    openVideoDeleteDialog: () => setIsDeleteDialogOpen(true),
    confirmDeleteVideo,
    closeDeleteTransactionDialog: () => setDeleteTransactionStatus(null),
    isDeleteDialogOpen,
    deleteTransactionStatus,
  }
}
