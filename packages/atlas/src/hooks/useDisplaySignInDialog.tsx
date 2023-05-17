import { useCallback } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SignInDialogContent } from '@/components/_overlays/SignInDialogContent'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { isMobile } from '@/utils/browser'

type OpenSignInDialogArgs = {
  onCancel?: () => void
  onConfirm?: () => void
}

const isMobileDevice = isMobile()

export const useDisplaySignInDialog = (props?: { interaction: boolean }) => {
  const { interaction = false } = props || {}
  const [openDialog, closeDialog] = useConfirmationModal()

  const openSignInDialog = useCallback(
    ({ onCancel, onConfirm }: OpenSignInDialogArgs) => {
      const handleCancel = () => {
        onCancel?.()
        closeDialog()
      }
      openDialog({
        dividers: true,
        children: <SignInDialogContent isMobileDevice={isMobileDevice} interaction={interaction} />,
        noIcon: true,
        primaryButton: {
          text: isMobileDevice ? 'Log in anyway' : 'Log in',
          onClick: () => {
            onConfirm?.()
            closeDialog()
          },
        },
        secondaryButton: {
          text: isMobileDevice ? 'Share link' : 'Cancel',
          onClick: () => {
            if (isMobileDevice) {
              navigator.share({ url: window.location.origin })
              return
            }
            handleCancel()
          },
        },
        additionalActionsNode: isMobileDevice && (
          <Button variant="tertiary" onClick={handleCancel}>
            Cancel
          </Button>
        ),
        additionalActionsNodeMobilePosition: 'bottom',
      })
    },
    [closeDialog, interaction, openDialog]
  )

  return {
    openSignInDialog,
  }
}
