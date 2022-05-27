import styled from '@emotion/styled'
import { useCallback } from 'react'

import { Text } from '@/components/Text'
import { SvgLargeWall, SvgOtherSignInDialogPatterns } from '@/components/_illustrations'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { cVar, media, sizes } from '@/styles'

const SignInDialogcontent = () => {
  return (
    <>
      <IllustrationWrapper>
        <StyledSvgLargeWall />
        <StyledSvgOtherSignInDialogPatterns />
      </IllustrationWrapper>
      <SignInDialogTextWrapper>
        <Text variant="h500">Sign in to continue</Text>
        <Text variant="t200" secondary>
          Sign in to Joystream using Polkadot extension in order proceed.
        </Text>
      </SignInDialogTextWrapper>
    </>
  )
}

const IllustrationWrapper = styled.div`
  position: relative;
  height: 180px;
  background-color: ${cVar('colorBackground')};
  margin: calc(var(--local-size-dialog-padding) * -1) calc(var(--local-size-dialog-padding) * -1) ${sizes(6)}
    calc(var(--local-size-dialog-padding) * -1);
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.sm} {
    height: 270px;
  }
`

const SignInDialogTextWrapper = styled.div`
  margin: 0 auto;
  max-width: 300px;
  text-align: center;
  display: grid;
  grid-auto-rows: auto;
  grid-gap: ${sizes(2)};
`

const StyledSvgLargeWall = styled(SvgLargeWall)`
  max-width: 256px;
  max-height: 256px;
  display: block;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  ${media.sm} {
    max-width: 320px;
    max-height: 320px;
  }
`

const StyledSvgOtherSignInDialogPatterns = styled(SvgOtherSignInDialogPatterns)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  max-width: 100%;
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
        description: <SignInDialogcontent />,
        noIcon: true,
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
