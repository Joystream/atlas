import { useMemo, useRef, useState } from 'react'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useAuthStore } from '@/providers/auth/auth.store'
import { formatDurationBiggestTick } from '@/utils/time'

import { CheckEmailConfirmation } from '../genericSteps/CheckEmailConfirmation'
import { ProvideEmailForLink } from '../genericSteps/ProvideEmailForLink'
import { SetActionButtonHandler } from '../genericSteps/types'

enum EmailSetupStep {
  email,
  confirmationLink,
}

type EmailSetupForm = {
  email?: string
}

export const EmailSetup = () => {
  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const [step, setStep] = useState(EmailSetupStep.email)
  const [primaryAction, setPrimaryAction] = useState<undefined | SetActionButtonHandler>(undefined)
  const formRef = useRef<EmailSetupForm>({})
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const primaryButton = useMemo(() => {
    if (step === EmailSetupStep.confirmationLink) {
      return {
        text: loading ? 'Sending...' : timeLeft ? `Resend (${timeLeft.replace('seconds', 's')})` : 'Resend',
        onClick: () => primaryAction?.(setLoading),
        disabled: !!timeLeft || loading,
      }
    }

    return {
      text: 'Continue',
      onClick: () => primaryAction?.(setLoading),
    }
  }, [loading, primaryAction, step, timeLeft])

  const secondaryButton = useMemo(() => {
    if (step === EmailSetupStep.confirmationLink) {
      return {
        text: 'Go back',
        onClick: () => setStep(EmailSetupStep.email),
      }
    }

    return undefined
  }, [step])

  return (
    <DialogModal
      disableBackdropAnimation
      show={authModalOpenName === 'emailSetup'}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      additionalActionsNode={
        <Button variant="tertiary" onClick={() => setAuthModalOpenName(undefined)}>
          Close
        </Button>
      }
    >
      {step === EmailSetupStep.email ? (
        <ProvideEmailForLink
          onSubmit={(email) => {
            setStep(EmailSetupStep.confirmationLink)
            formRef.current = {
              ...formRef.current,
              email,
            }
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}
      {step === EmailSetupStep.confirmationLink ? (
        <CheckEmailConfirmation
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
          onSuccess={() => {
            const resendTimestamp = new Date()

            const calcRemainingTime = (date: Date) => {
              const difference = Date.now() - date.getTime()
              if (difference > 30_000) {
                clearInterval(id)
                setTimeLeft('')
                return
              }
              const duration = formatDurationBiggestTick(Math.floor(30 - difference / 1000))
              setTimeLeft(duration)
            }

            calcRemainingTime(resendTimestamp)
            const id = setInterval(() => {
              calcRemainingTime(resendTimestamp)
            }, 1000)
          }}
        />
      ) : null}
    </DialogModal>
  )
}
