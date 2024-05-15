import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DialogModal } from '@/components/_overlays/DialogModal'

import { CreatePassword } from '../genericSteps/CreatePassword'
import { EmailVerified } from '../genericSteps/EmailVerified'
import { SeedGeneration } from '../genericSteps/SeedGeneration'
import { WaitingModal } from '../genericSteps/WaitingModal'
import { SetActionButtonHandler } from '../genericSteps/types'

enum AccountSetupStep {
  verification,
  password,
  seed,
  creation,
}

type AccountSetupForm = {
  password?: string
  confirmPassword?: string
  mnemonic?: string
}

export const AccountSetup = () => {
  const [searchParams] = useSearchParams()
  const confirmationCode = searchParams.get('email-confirmation')
  const [step, setStep] = useState(AccountSetupStep.verification)
  const [loading, setLoading] = useState(true)
  const [primaryAction, setPrimaryAction] = useState<undefined | SetActionButtonHandler>(undefined)
  const formRef = useRef<AccountSetupForm>({})

  const primaryButton = useMemo(() => {
    if (step === AccountSetupStep.verification) {
      return {
        text: loading ? 'Verifying...' : 'Set password',
        onClick: () => setStep(AccountSetupStep.password),
        disabled: loading,
      }
    }

    if (step === AccountSetupStep.password || step === AccountSetupStep.seed) {
      return {
        text: 'Continue',
        onClick: () => {
          primaryAction?.()
        },
      }
    }

    return {
      text: 'Continue',
      onClick: () => primaryAction?.(setLoading),
    }
  }, [loading, primaryAction, step])

  const secondaryButton = useMemo(() => {
    if ([AccountSetupStep.verification, AccountSetupStep.password].includes(step)) {
      return {
        text: 'Cancel',
        onClick: () => setStep(AccountSetupStep.verification),
      }
    }

    return {
      text: 'Go back',
      onClick: () => setStep((prev) => prev - 1),
    }
  }, [step])

  if (!confirmationCode) {
    return null
  }

  return (
    <DialogModal primaryButton={primaryButton} secondaryButton={secondaryButton} show>
      {step === AccountSetupStep.verification ? (
        <EmailVerified onVerified={() => setLoading(false)} code={confirmationCode} />
      ) : null}

      {step === AccountSetupStep.password ? (
        <CreatePassword
          defaultValues={formRef.current}
          onSubmit={(data) => {
            setStep(AccountSetupStep.seed)
            formRef.current = {
              ...formRef.current,
              ...data,
            }
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}

      {step === AccountSetupStep.seed ? (
        <SeedGeneration
          defaultValues={formRef.current}
          onSubmit={(data) => {
            setStep(AccountSetupStep.creation)
            formRef.current = {
              ...formRef.current,
              ...data,
            }
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}

      {step === AccountSetupStep.creation ? (
        <WaitingModal
          title="Account and channel creation..."
          description="Please wait and don't close this tab as we're creating your Joystream account and channel"
        />
      ) : null}
    </DialogModal>
  )
}
