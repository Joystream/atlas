import React, { useEffect } from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { TextContainer, StyledTransactionIllustration, StyledSpinner, StepsBar, Step } from './TransactionDialog.style'
import { StyledTitleText, StyledDescriptionText } from '../MessageDialog/MessageDialog.style'
import { ExtrinsicStatus } from '@/joystream-lib'
import { Tooltip } from '@/shared/components'
import { useDialog } from '@/hooks'

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

const STATUS_ERROR_DIALOG = 'STATUS_ERROR_DIALOG'
const STATUS_COMPLETED_DIALOG = 'STATUS_ERROR_COMPLETED'

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  status,
  successTitle,
  successDescription,
  onClose,
  ...actionDialogProps
}) => {
  const { openDialog, closeDialog } = useDialog()

  useEffect(() => {
    if (status !== ExtrinsicStatus.Error) {
      return
    }
    openDialog(STATUS_ERROR_DIALOG, {
      variant: 'error',
      title: 'Something went wrong...',
      description:
        'Some unexpected error was encountered. If this persists, our Discord community may be a good place to find some help.',
      secondaryButtonText: 'Close',
      onSecondaryButtonClick: () => {
        onClose()
        closeDialog(STATUS_ERROR_DIALOG)
      },
    })
  }, [closeDialog, onClose, openDialog, status])

  useEffect(() => {
    if (status !== ExtrinsicStatus.Completed) {
      return
    }
    openDialog(STATUS_COMPLETED_DIALOG, {
      variant: 'success',
      title: successTitle,
      description: successDescription,
      secondaryButtonText: 'Close',
      onSecondaryButtonClick: () => {
        onClose()
        closeDialog(STATUS_COMPLETED_DIALOG)
      },
    })
  }, [closeDialog, onClose, openDialog, status, successDescription, successTitle])

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
