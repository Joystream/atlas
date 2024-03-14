import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { SvgAlertsInformative32 } from '@/assets/icons'
import { SwapExpired } from '@/components/ChangeNowModal/steps/SwapExpired'
import { Spinner } from '@/components/_loaders/Spinner'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers/personalData'

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

    if (step === ChangeNowModalStep.PROGRESS) {
      setPrimaryButtonProps(undefined)
    }
  }, [step, type])

  const secondaryButton = useMemo(() => {
    if ([ChangeNowModalStep.INFO, ChangeNowModalStep.SWAP_EXPIRED].includes(step)) {
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
    onClose,
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
      show={true}
      dividers={![ChangeNowModalStep.INFO, ChangeNowModalStep.SWAP_EXPIRED].includes(step)}
      onExitClick={step === ChangeNowModalStep.SWAP_EXPIRED ? undefined : () => onClose()}
      primaryButton={primaryButtonProps}
      secondaryButton={secondaryButton}
      additionalActionsNode={step === ChangeNowModalStep.PROGRESS && primaryButtonProps ? <Spinner /> : null}
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
