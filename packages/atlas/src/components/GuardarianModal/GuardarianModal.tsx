import { useRef, useState } from 'react'

import { GuardarianModalSteps } from './GuardarianModal.types'
import { GuardarianBillingInfo, GuardarianModalBillingInfoStep } from './steps/GuardarianModalBillingInfoStep'
import { GuardarianForm, GuardarianModalFormStep } from './steps/GuardarianModalFormStep'

import { Button } from '../_buttons/Button'
import { DialogModal } from '../_overlays/DialogModal'

type LoadingSetter = (value: boolean) => void
export type SetActionButtonHandler = (setLoading?: LoadingSetter) => void | Promise<void>

type GuardarianData = GuardarianBillingInfo & GuardarianForm

export const GuardarianModal = () => {
  const [step, setStep] = useState(GuardarianModalSteps.INFO)
  const [primaryAction, setPrimaryAction] = useState<undefined | SetActionButtonHandler>(undefined)
  const formRef = useRef<GuardarianData>({
    from: {
      currency: undefined,
      amount: undefined,
    },
    to: {
      currency: undefined,
      amount: undefined,
    },
  })

  return (
    <DialogModal
      size={step === GuardarianModalSteps.FORM ? 'small' : 'medium'}
      title="Guardarian"
      show
      primaryButton={{
        text: 'Continue',
        onClick: () => primaryAction?.(),
      }}
      additionalActionsNode={
        [GuardarianModalSteps.INFO].includes(step) ? <Button variant="secondary">Cancel</Button> : null
      }
    >
      {step === GuardarianModalSteps.INFO ? (
        <GuardarianModalBillingInfoStep
          onSubmit={(data) => {
            formRef.current = {
              ...formRef.current,
              ...data,
            }
            setStep(GuardarianModalSteps.FORM)
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}
      {step === GuardarianModalSteps.FORM ? (
        <GuardarianModalFormStep
          onSubmit={(data) => {
            formRef.current = {
              ...formRef.current,
              ...data,
            }
            // setStep(GuardarianModalSteps.FORM)
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}
    </DialogModal>
  )
}
