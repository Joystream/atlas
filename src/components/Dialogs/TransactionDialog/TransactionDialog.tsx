import React from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { TextContainer, StyledTransactionIllustration, Spinner } from './TransactionDialog.style'
import { StyledTitleText, StyledDescriptionText } from '../MessageDialog/MessageDialog.style'

export type TransactionDialogProps = {
  title: string
  description: string
} & ActionDialogProps

const TransactionDialog: React.FC<TransactionDialogProps> = ({ title, description, ...actionDialogProps }) => {
  return (
    <ActionDialog {...actionDialogProps} exitButton={false}>
      <StyledTransactionIllustration />
      <Spinner />
      <TextContainer>
        {title && <StyledTitleText variant="h4">{title}</StyledTitleText>}
        <StyledDescriptionText variant="body2">{description}</StyledDescriptionText>
      </TextContainer>
    </ActionDialog>
  )
}

export default TransactionDialog
