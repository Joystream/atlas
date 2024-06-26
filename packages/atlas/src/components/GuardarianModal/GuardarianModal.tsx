import styled from '@emotion/styled'
import { useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import { guardarianService } from '@/utils/GuardarianService'

import { GuardarianModalSteps } from './GuardarianModal.types'
import { GuardarianBillingInfo, GuardarianModalBillingInfoStep } from './steps/GuardarianModalBillingInfoStep'
import { GuardarianForm, GuardarianModalFormStep } from './steps/GuardarianModalFormStep'
import { GuardarianProgressModal } from './steps/GuardarianProgressModal'

import { Button } from '../_buttons/Button'
import { DialogModal } from '../_overlays/DialogModal'

type LoadingSetter = (value: boolean) => void
export type SetActionButtonHandler = (setLoading?: LoadingSetter) => void | Promise<void>

type GuardarianData = GuardarianBillingInfo & GuardarianForm

export const GuardarianModal = () => {
  const [step, setStep] = useState(GuardarianModalSteps.INFO)
  const [checkoutUrl, setCheckoutUrl] = useState('')
  const [transactionId, setTransactionId] = useState('')
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
          onSubmit={async (data) => {
            formRef.current = {
              ...formRef.current,
              ...data,
            }
            const { from, to, ...billingInfo } = formRef.current

            const response = await guardarianService.createTransaction({
              amount: from.amount ?? 0,
              from: from as { currency: string },
              to: to as { currency: string },
              billingInfo: {
                ...billingInfo,
              },
            })

            setCheckoutUrl(response.data.redirect_url)

            setStep(GuardarianModalSteps.PROGRESS)
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}
      {step === GuardarianModalSteps.FAILED ? <div>failed</div> : null}
      {step === GuardarianModalSteps.SUCCESS ? <div>success</div> : null}
      {step === GuardarianModalSteps.TIMEOUT ? <div>transaction timeouted</div> : null}
      {step === GuardarianModalSteps.PROGRESS && transactionId ? (
        <GuardarianProgressModal transactionId={transactionId} goToStep={setStep} />
      ) : null}
      {checkoutUrl
        ? ReactDOM.createPortal(
            <FrameBox>
              <StyledFrame src={checkoutUrl} />
            </FrameBox>,
            document.body
          )
        : null}
    </DialogModal>
  )
}

const FrameBox = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
`

export const StyledFrame = styled.iframe`
  width: 90vw;
  height: 90vh;
  z-index: 9999;
`
