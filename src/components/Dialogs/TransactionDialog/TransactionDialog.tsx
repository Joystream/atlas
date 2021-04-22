import React from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { TextContainer, StyledTransactionIllustration, StyledSpinner } from './TransactionDialog.style'
import { StyledTitleText, StyledDescriptionText } from '../MessageDialog/MessageDialog.style'
import { ExtrinsicStatus } from '@/joystream-lib'
import MessageDialog from '../MessageDialog'

export type TransactionDialogProps = Pick<ActionDialogProps, 'className'> & {
  status: ExtrinsicStatus | null
  successTitle: string
  successDescription: string
  onClose: () => void
}

const TRANSACTION_STEPS_DETAILS = {
  [ExtrinsicStatus.ProcessingAssets]: {
    title: 'Processing assets...',
    description:
      "Please wait till all your assets get processed. This can take up to 1 minute, depending on asset size and your machine's computing power.",
  },
  [ExtrinsicStatus.Unsigned]: {
    title: 'Waiting for signature...',
    description: 'Please sign the transaction using the Polkadot browser extension.',
  },
  [ExtrinsicStatus.Signed]: {
    title: 'Waiting for confirmation...',
    description:
      'Your transaction has been signed and sent. Please wait for the blockchain confirmation. This should take about 15 seconds.',
  },
  [ExtrinsicStatus.Syncing]: {
    title: 'Waiting for data propagation...',
    description:
      "Your transaction has been accepted and included into the blockchain. Please wait till it's picked up by the indexing node. This should take up to 15 seconds.",
  },
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  status,
  successTitle,
  successDescription,
  onClose,
  ...actionDialogProps
}) => {
  if (status === ExtrinsicStatus.Error) {
    return (
      <MessageDialog
        showDialog
        variant="error"
        title="Something went wrong..."
        description="Some unexpected error was encountered. If this persists, our Discord community may be a good place to find some help."
        secondaryButtonText="Close"
        onSecondaryButtonClick={onClose}
      />
    )
  }

  if (status === ExtrinsicStatus.Completed) {
    return (
      <MessageDialog
        showDialog
        variant="success"
        title={successTitle}
        description={successDescription}
        secondaryButtonText="Close"
        onSecondaryButtonClick={onClose}
      />
    )
  }

  const stepDetails = status != null ? TRANSACTION_STEPS_DETAILS[status] : null

  const canCancel = status === ExtrinsicStatus.ProcessingAssets || ExtrinsicStatus.Unsigned

  return (
    <ActionDialog
      showDialog={status != null}
      onSecondaryButtonClick={onClose}
      secondaryButtonText="Cancel"
      secondaryButtonDisabled={!canCancel}
      exitButton={false}
      {...actionDialogProps}
    >
      <StyledTransactionIllustration />
      <StyledSpinner />
      <TextContainer>
        <StyledTitleText variant="h4">{stepDetails?.title}</StyledTitleText>
        <StyledDescriptionText variant="body2">{stepDetails?.description}</StyledDescriptionText>
      </TextContainer>
    </ActionDialog>
  )
}

export default TransactionDialog
