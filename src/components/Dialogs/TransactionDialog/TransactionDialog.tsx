import React from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { TextContainer, StyledTransactionIllustration, StyledSpinner, StepsBar, Step } from './TransactionDialog.style'
import { StyledTitleText, StyledDescriptionText } from '../MessageDialog/MessageDialog.style'
import { ExtrinsicStatus } from '@/joystream-lib'
import { Tooltip } from '@/shared/components'

export type TransactionDialogProps = Pick<ActionDialogProps, 'className'> & {
  status: ExtrinsicStatus | null
  onClose: () => void
}

const TRANSACTION_STEPS_DETAILS = {
  [ExtrinsicStatus.ProcessingAssets]: {
    title: 'Processing assets...',
    description:
      "Please wait till all your assets get processed. This can take up to 1 minute, depending on asset size and your machine's computing power.",
    tooltip: '',
  },
  [ExtrinsicStatus.Unsigned]: {
    title: 'Waiting for signature...',
    description: 'Please sign the transaction using the Polkadot browser extension.',
    tooltip: 'Signature',
  },
  [ExtrinsicStatus.Signed]: {
    title: 'Waiting for confirmation...',
    description:
      'Your transaction has been signed and sent. Please wait for the blockchain confirmation. This should take about 15 seconds.',
    tooltip: 'Confirmation',
  },
  [ExtrinsicStatus.Syncing]: {
    title: 'Waiting for data propagation...',
    description:
      "Your transaction has been accepted and included into the blockchain. Please wait till it's picked up by the indexing node. This should take up to 15 seconds.",
    tooltip: 'Propagation',
  },
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({ status, onClose, ...actionDialogProps }) => {
  if (status === ExtrinsicStatus.Error || status === ExtrinsicStatus.Completed) {
    return null
  }

  const stepDetails = status != null ? TRANSACTION_STEPS_DETAILS[status] : null

  const canCancel = status === ExtrinsicStatus.ProcessingAssets || ExtrinsicStatus.Unsigned

  const transactionStepsWithoutProcessingAssets = Object.values(TRANSACTION_STEPS_DETAILS).filter(
    (step) => step.title !== TRANSACTION_STEPS_DETAILS[ExtrinsicStatus.ProcessingAssets].title
  )

  return (
    <ActionDialog
      showDialog={status != null}
      onSecondaryButtonClick={onClose}
      secondaryButtonText="Cancel"
      secondaryButtonDisabled={!canCancel}
      exitButton={false}
      {...actionDialogProps}
    >
      <StepsBar>
        {transactionStepsWithoutProcessingAssets.map(({ title, tooltip }, idx) => (
          <Tooltip key={idx} text={tooltip} placement="top-end">
            <Step isActive={!!status && status > idx} />
          </Tooltip>
        ))}
      </StepsBar>
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
