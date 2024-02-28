import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { SvgAlertsInformative32 } from '@/assets/icons'
import { SwapExpired } from '@/components/ChangeNowModal/steps/SwapExpired'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'

import { FormData, FormStep } from './steps/FormStep'
import { InformationStep } from './steps/InformationStep'
import { ProgressStep } from './steps/ProgressStep'
import { SummaryStep } from './steps/SummaryStep'
import { ChangeNowModalStep, TransactionType } from './steps/types'

type ChangeNowModalProps = {
  type: TransactionType
  onClose: () => void
}

export const ChangeNowModal = ({ type, onClose }: ChangeNowModalProps) => {
  const [step, setStep] = useState(ChangeNowModalStep.PROGRESS)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
  const formData = useRef<FormData | null>(null)

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
    if (ChangeNowModalStep.INFO || ChangeNowModalStep.SWAP_EXPIRED) {
      return {
        text: 'Cancel',
        onClick: () => onClose(),
      }
    }

    return {
      text: 'Back',
      onClick: () => setStep((prev) => prev - 1),
    }
  }, [onClose])

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
        <FormStep
          {...commonProps}
          initialValues={formData.current}
          onSubmit={(data) => {
            formData.current = data
            setStep(ChangeNowModalStep.SUMMARY)
          }}
        />
      )}
      {step === ChangeNowModalStep.SUMMARY && formData.current && (
        <SummaryStep {...commonProps} formData={formData.current} />
      )}
      {step === ChangeNowModalStep.PROGRESS && <ProgressStep />}
      {step === ChangeNowModalStep.SWAP_EXPIRED && <SwapExpired />}
    </DialogModal>
  )
}
