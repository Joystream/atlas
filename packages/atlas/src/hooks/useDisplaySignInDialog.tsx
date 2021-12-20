import styled from '@emotion/styled'
import React, { useCallback } from 'react'

import { Text } from '@/components/Text'
import { SvgSignUpDialogIllustration } from '@/components/_illustrations'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { media, sizes } from '@/styles'

const SignInDialogcontent = () => {
  return (
    <>
      <StyledSvgSignUpDialogIllustration />
      <SignInDialogTextWrapper>
        <Text variant="h500">Sign up to Joystream</Text>
        <Text variant="t200" secondary>
          To proceed you have to Sign up with PolkaDot extension.
        </Text>
      </SignInDialogTextWrapper>
    </>
  )
}
const SignInDialogTextWrapper = styled.div`
  margin: 0 auto;
  max-width: 300px;
  text-align: center;
  display: grid;
  grid-auto-rows: auto;
  grid-gap: ${sizes(2)};
`
const StyledSvgSignUpDialogIllustration = styled(SvgSignUpDialogIllustration)`
  max-width: 256px;
  max-height: 210px;
  display: block;
  margin: 0 auto;
  ${media.xs} {
    max-width: 100%;
    max-height: 100%;
  }
`
type OpenSignInDialogArgs = {
  onCancel?: () => void
  onConfirm?: () => void
}

export const useDisplaySignInDialog = () => {
  const [openDialog, closeDialog] = useConfirmationModal()

  const openSignInDialog = useCallback(
    ({ onCancel, onConfirm }: OpenSignInDialogArgs) => {
      openDialog({
        dividers: true,
        children: <SignInDialogcontent />,
        primaryButton: {
          text: 'Sign in',
          onClick: () => {
            onConfirm?.()
            closeDialog()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            onCancel?.()
            closeDialog()
          },
        },
      })
    },
    [closeDialog, openDialog]
  )

  return {
    openSignInDialog,
  }
}
