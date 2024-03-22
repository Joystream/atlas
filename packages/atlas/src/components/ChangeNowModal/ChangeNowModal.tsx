import styled from '@emotion/styled'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { SvgAlertsInformative32, SvgLogoChangenow } from '@/assets/icons'
import { FailedStep } from '@/components/ChangeNowModal/steps/FailedStep'
import { SwapExpired } from '@/components/ChangeNowModal/steps/SwapExpired'
import { Spinner } from '@/components/_loaders/Spinner'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers/personalData'
import { cVar } from '@/styles'

import { FormData, FormStep } from './steps/FormStep'
import { CHANGE_NOW_DISMISSIBLE_ID, InformationStep } from './steps/InformationStep'
import { ProgressStep } from './steps/ProgressStep'
import { SummaryStep, TransactionData } from './steps/SummaryStep'
import { ChangeNowModalStep, TransactionType } from './steps/types'

type ChangeNowModalProps = {
  type: TransactionType
  onClose: () => void
}

export const ChangeNowModal = ({ type, onClose }: ChangeNowModalProps) => {
  const hasDismissedInfo =
    usePersonalDataStore((state) =>
      state.dismissedMessages.some((message) => message.id === CHANGE_NOW_DISMISSIBLE_ID)
    ) && !!CHANGE_NOW_DISMISSIBLE_ID
  const shouldOmitInfo = hasDismissedInfo && type !== 'topup'
  const [step, setStep] = useState(shouldOmitInfo ? ChangeNowModalStep.FORM : ChangeNowModalStep.INFO)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps | undefined>(undefined)
  const formData = useRef<FormData | null>(null)
  const transactionData = useRef<TransactionData | null>(null)

  useLayoutEffect(() => {
    if (step === ChangeNowModalStep.INFO) {
      setPrimaryButtonProps({
        text: type === 'sell' ? 'Cashout JOY' : 'Buy JOY',
        onClick: () => setStep(ChangeNowModalStep.FORM),
      })
    }

    if (step === ChangeNowModalStep.SWAP_EXPIRED) {
      setPrimaryButtonProps({
        text: 'Try again',
        onClick: () => setStep(ChangeNowModalStep.FORM),
      })
    }

    if (step === ChangeNowModalStep.FAILED) {
      setPrimaryButtonProps({
        text: 'Try again',
        onClick: () => setStep(ChangeNowModalStep.FORM),
      })
    }

    if (step === ChangeNowModalStep.PROGRESS) {
      setPrimaryButtonProps(undefined)
    }
  }, [step, type])

  const secondaryButton = useMemo(() => {
    if ([ChangeNowModalStep.INFO, ChangeNowModalStep.SWAP_EXPIRED, ChangeNowModalStep.FAILED].includes(step)) {
      return {
        text: 'Cancel',
        onClick: () => onClose(),
      }
    }

    if (step === ChangeNowModalStep.PROGRESS) {
      if (primaryButtonProps) {
        return {
          text: 'Go to dashboard',
          to: absoluteRoutes.viewer.portfolio(),
        }
      }
      return undefined
    }

    if (step === ChangeNowModalStep.FORM && shouldOmitInfo) {
      return undefined
    }

    return {
      text: 'Back',
      onClick: () => setStep((prev) => prev - 1),
    }
  }, [onClose, primaryButtonProps, shouldOmitInfo, step])

  const handleFormData = useCallback((data: FormData) => {
    formData.current = data
    setStep(ChangeNowModalStep.SUMMARY)
  }, [])

  const handleTransactionData = useCallback((data: TransactionData) => {
    transactionData.current = data
    setStep(ChangeNowModalStep.PROGRESS)
  }, [])

  const commonProps = {
    setPrimaryButtonProps,
    goToStep: setStep,
    onClose,
    type,
  }

  return (
    <DialogModal
      title={
        (type === 'topup' && step === ChangeNowModalStep.INFO) ||
        [ChangeNowModalStep.SWAP_EXPIRED, ChangeNowModalStep.FAILED].includes(step) ? (
          <StyledSvgAlertsInformative32 isFailed={step === ChangeNowModalStep.FAILED} />
        ) : type === 'sell' ? (
          'Cashout JOY'
        ) : (
          'Buy JOY'
        )
      }
      show
      dividers={![ChangeNowModalStep.INFO, ChangeNowModalStep.SWAP_EXPIRED, ChangeNowModalStep.FAILED].includes(step)}
      onExitClick={step === ChangeNowModalStep.SWAP_EXPIRED ? undefined : () => onClose()}
      primaryButton={
        primaryButtonProps
          ? { ...primaryButtonProps, variant: step === ChangeNowModalStep.FAILED ? 'destructive' : 'primary' }
          : undefined
      }
      secondaryButton={secondaryButton}
      additionalActionsNode={
        step === ChangeNowModalStep.PROGRESS && !primaryButtonProps ? <StyledSpinner /> : <StyledSvgLogoChangenow />
      }
    >
      {step === ChangeNowModalStep.INFO && <InformationStep {...commonProps} />}
      {step === ChangeNowModalStep.FORM && (
        <FormStep {...commonProps} initialValues={formData.current} onSubmit={handleFormData} />
      )}
      {step === ChangeNowModalStep.SUMMARY && formData.current && (
        <SummaryStep {...commonProps} formData={formData.current} setTransactionData={handleTransactionData} />
      )}
      {step === ChangeNowModalStep.PROGRESS && transactionData.current && (
        <ProgressStep {...commonProps} transactionData={transactionData.current} />
      )}
      {step === ChangeNowModalStep.SWAP_EXPIRED && <SwapExpired />}
      {step === ChangeNowModalStep.FAILED && transactionData.current && (
        <FailedStep {...commonProps} transactionData={transactionData.current} />
      )}
    </DialogModal>
  )
}

const StyledSvgAlertsInformative32 = styled(SvgAlertsInformative32)<{ isFailed: boolean }>`
  padding: 1px;

  path {
    fill: ${({ isFailed }) => (isFailed ? cVar('colorTextError') : 'unset')};
  }
`

const StyledSpinner = styled(Spinner)`
  margin: 0;
`

const StyledSvgLogoChangenow = styled(SvgLogoChangenow)`
  height: 30px;
  width: 60px;
`
