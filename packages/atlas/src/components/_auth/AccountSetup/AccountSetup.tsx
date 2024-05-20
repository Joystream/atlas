import { useCallback, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DialogModal } from '@/components/_overlays/DialogModal'
import { useCreateMember } from '@/hooks/useCreateMember'
import { useSnackbar } from '@/providers/snackbars'

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
  captchaToken?: string
  email?: string
}

export const AccountSetup = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const confirmationCode = searchParams.get('email-token') // 5y6WUaZ5IxAGf4iLGarc1OHFHBWScJZ4/gxWGn4trq4=
  console.log('xdd', confirmationCode)
  const [step, setStep] = useState(AccountSetupStep.verification)
  const [loading, setLoading] = useState(true)
  const [primaryAction, setPrimaryAction] = useState<undefined | SetActionButtonHandler>(undefined)
  const formRef = useRef<AccountSetupForm>({})
  const { createNewMember, createNewOrionAccount } = useCreateMember()
  const { displaySnackbar } = useSnackbar()

  const resetSearchParams = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])

  const primaryButton = useMemo(() => {
    if (step === AccountSetupStep.verification) {
      return {
        text: loading ? 'Verifying...' : 'Set password',
        onClick: () => setStep(AccountSetupStep.password),
        disabled: loading,
      }
    }

    if (step === AccountSetupStep.creation) {
      return {
        text: 'Waiting...',
        onClick: () => setStep(AccountSetupStep.password),
        disabled: true,
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
    if ([AccountSetupStep.verification, AccountSetupStep.password, AccountSetupStep.creation].includes(step)) {
      return {
        text: 'Cancel',
        onClick: () => resetSearchParams(),
      }
    }

    return {
      text: 'Go back',
      onClick: () => setStep((prev) => prev - 1),
    }
  }, [resetSearchParams, step])

  const handleAccountAndMemberCreation = async () => {
    await createNewOrionAccount({
      data: {
        confirmedTerms: true,
        email: formRef.current.email ?? 'alek12342@gmail.com',
        mnemonic: formRef.current.mnemonic ?? '',
        password: formRef.current.password ?? '',
        emailConfimationToken: confirmationCode ?? '',
      },
      onError: () => {
        resetSearchParams()
      },
      onSuccess: async () => {
        const membershipId = await createNewMember({
          data: {
            handle: 'testttt1',
            captchaToken: formRef.current.captchaToken ?? '',
            allowDownload: true,
            mnemonic: formRef.current.mnemonic ?? '',
          },
          onError: () => {
            displaySnackbar({
              iconType: 'error',
              title: 'Error during membership creation',
            })
            resetSearchParams()
          },
        })
      },
    })
  }

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
            handleAccountAndMemberCreation()
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
