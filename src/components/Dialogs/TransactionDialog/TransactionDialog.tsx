import React from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { TextContainer, StyledTransactionIllustration, Spinner } from './TransactionDialog.style'
import { StyledTitleText, StyledDescriptionText } from '../MessageDialog/MessageDialog.style'
import { ExtrinsicStatus } from '@/joystream-lib'

export type TransactionDialogProps = Pick<ActionDialogProps, 'onEnter' | 'onExit' | 'className'> & {
  onCancel?: () => void
  status: ExtrinsicStatus | null
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({ onCancel, status, ...actionDialogProps }) => {
  return (
    <ActionDialog
      showDialog={status != null}
      onSecondaryButtonClick={onCancel}
      secondaryButtonText="Cancel"
      exitButton={false}
      {...actionDialogProps}
    >
      <StyledTransactionIllustration />
      <Spinner />
      <TextContainer>
        <StyledTitleText variant="h4">Waiting for funds...</StyledTitleText>
        <StyledDescriptionText variant="body2">
          Sign the transaction using external signer app. It usually takes several seconds to from signing the
          transaction with external signer app long text.
        </StyledDescriptionText>
      </TextContainer>
    </ActionDialog>
  )
}

export default TransactionDialog
