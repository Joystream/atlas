import { useLayoutEffect, useRef, useState } from 'react'

import { SvgAlertsInformative32 } from '@/assets/icons'
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
  const [step, setStep] = useState(ChangeNowModalStep.INFO)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
  const formData = useRef<FormData | null>(null)

  useLayoutEffect(() => {
    if (step === ChangeNowModalStep.INFO) {
      setPrimaryButtonProps({
        text: type === 'sell' ? 'Cashout JOY' : 'Buy JOY',
        onClick: () => setStep(ChangeNowModalStep.FORM),
      })
    }
  }, [step, type])

  const secondaryButton =
    step === ChangeNowModalStep.INFO
      ? {
          text: 'Cancel',
          onClick: () => onClose(),
        }
      : {
          text: 'Back',
          onClick: () => setStep((prev) => prev - 1),
        }

  const commonProps = {
    setPrimaryButtonProps,
    goToStep: setStep,
    type,
  }

  return (
    <DialogModal
      title={
        type === 'topup' && step === ChangeNowModalStep.INFO ? (
          <SvgAlertsInformative32 />
        ) : type === 'sell' ? (
          'Cashout JOY'
        ) : (
          'Buy JOY'
        )
      }
      show
      dividers={step !== ChangeNowModalStep.INFO}
      onExitClick={() => undefined}
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
    </DialogModal>
  )
}
