import { useState } from 'react'
import { useJoystream, useAuthorizedUser, useTransactionManager } from '@/hooks'

export const useDeleteVideo = () => {
  const { joystream } = useJoystream()
  const { handleTransaction } = useTransactionManager()
  const { activeMemberId } = useAuthorizedUser()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const confirmDeleteVideo = async (videoId: string, onTxSync?: () => void) => {
    if (!joystream) {
      return
    }

    setIsDeleteDialogOpen(false)

    handleTransaction({
      txFactory: (updateStatus) => joystream.deleteVideo(videoId, activeMemberId, updateStatus),
      onTxSync,
      successMessage: {
        title: 'Video successfully deleted!',
        description: 'Your video was marked as deleted and it will no longer show up on Joystream.',
      },
    })
  }

  return {
    closeVideoDeleteDialog: () => setIsDeleteDialogOpen(false),
    openVideoDeleteDialog: () => setIsDeleteDialogOpen(true),
    confirmDeleteVideo,
    isDeleteDialogOpen,
  }
}
