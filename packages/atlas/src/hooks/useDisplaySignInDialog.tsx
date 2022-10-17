import styled from '@emotion/styled'
import { useCallback } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SignInDialogContent } from '@/components/_overlays/SignInDialogContent'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { media, sizes } from '@/styles'
import { isMobile } from '@/utils/browser'

type OpenSignInDialogArgs = {
  onCancel?: () => void
  onConfirm?: () => void
}

const isMobileDevice = isMobile()

export const useDisplaySignInDialog = () => {
  const [openDialog, closeDialog] = useConfirmationModal()

  const openSignInDialog = useCallback(
    ({ onCancel, onConfirm }: OpenSignInDialogArgs) => {
      const handleCancel = () => {
        onCancel?.()
        closeDialog()
      }
      openDialog({
        dividers: true,
        children: <SignInDialogContent isMobileDevice={isMobileDevice} />,
        noIcon: true,
        primaryButton: {
          text: isMobileDevice ? 'Connect anyway' : 'Connect wallet',
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
          <StyledButton variant="tertiary" onClick={handleCancel}>
            Cancel
          </StyledButton>
        ),
      })
    },
    [closeDialog, openDialog]
  )

  return {
    openSignInDialog,
  }
}

export const StyledButton = styled(Button)`
  order: 3;
  margin-top: ${sizes(2)};

  ${media.sm} {
    order: unset;
  }
`
