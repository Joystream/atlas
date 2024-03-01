import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { SvgAlertsInformative32 } from '@/assets/icons'
import { SwapExpired } from '@/components/ChangeNowModal/steps/SwapExpired'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'

import { FormData, FormStep } from './steps/FormStep'
import { InformationStep } from './steps/InformationStep'
import { ProgressStep } from './steps/ProgressStep'
import { SummaryStep, TransactionData } from './steps/SummaryStep'
import { ChangeNowModalStep, TransactionType } from './steps/types'

type ChangeNowModalProps = {
  type: TransactionType
  onClose: () => void
}

export const ChangeNowModal = ({ type, onClose }: ChangeNowModalProps) => {
  const [step, setStep] = useState(ChangeNowModalStep.INFO)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
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
  }, [step, type])

  const secondaryButton = useMemo(() => {
    if ([ChangeNowModalStep.INFO, ChangeNowModalStep.SWAP_EXPIRED].includes(step)) {
      return {
        text: 'Cancel',
        onClick: () => onClose(),
      }
    }

    return {
      text: 'Back',
      onClick: () => setStep((prev) => prev - 1),
    }
  }, [onClose, step])

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
    type,
  }

  return (
    <DialogModal
      title={
        (type === 'topup' && step === ChangeNowModalStep.INFO) || step === ChangeNowModalStep.SWAP_EXPIRED ? (
          <SvgAlertsInformative32 />
        ) : type === 'sell' ? (
          'Cashout JOY'
        ) : (
          'Buy JOY'
        )
      }
      show
      dividers={![ChangeNowModalStep.INFO, ChangeNowModalStep.SWAP_EXPIRED].includes(step)}
      onExitClick={step === ChangeNowModalStep.SWAP_EXPIRED ? undefined : () => undefined}
      primaryButton={primaryButtonProps}
      secondaryButton={secondaryButton}
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
    </DialogModal>
  )
}
