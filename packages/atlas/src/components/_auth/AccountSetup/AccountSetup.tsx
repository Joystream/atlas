import { useCallback, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DialogModal } from '@/components/_overlays/DialogModal'
import { useCreateMember } from '@/hooks/useCreateMember'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'

import { CreateHandle, NewHandleForm } from '../genericSteps/CreateHandle'
import { CreatePassword, NewPasswordForm } from '../genericSteps/CreatePassword'
import { EmailVerified } from '../genericSteps/EmailVerified'
import { SeedGeneration } from '../genericSteps/SeedGeneration'
import { WaitingModal } from '../genericSteps/WaitingModal'
import { SetActionButtonHandler } from '../genericSteps/types'

enum AccountSetupStep {
  verification,
  password,
  member,
  seed,
  creation,
}

type AccountSetupForm = {
  mnemonic?: string
} & NewHandleForm &
  NewPasswordForm

export const AccountSetup = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { refetchCurrentUser } = useAuth()
  const { refetchUserMemberships } = useUser()
  const confirmationCode = decodeURIComponent(searchParams.get('email-token') ?? '') // 5y6WUaZ5IxAGf4iLGarc1OHFHBWScJZ4/gxWGn4trq4=
  const email = decodeURIComponent(searchParams.get('email') ?? '')
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
    const { avatar, password, handle, mnemonic } = formRef.current

    if (!(avatar && password && email && handle && mnemonic)) {
      displaySnackbar({
        title: 'Creation failed',
        description: 'Missing required fields to create an account',
        iconType: 'error',
      })
      SentryLogger.error('Missing fields during account creation', 'AccountSetup', { form: formRef.current })
      setStep(AccountSetupStep.password)
      return
    }
    await createNewOrionAccount({
      data: {
        confirmedTerms: true,
        email: email ?? '',
        mnemonic: formRef.current.mnemonic ?? '',
        password: formRef.current.password ?? '',
        emailConfimationToken: confirmationCode ?? '',
      },
      onError: () => {
        resetSearchParams()
      },
      onSuccess: async () => {
        await new Promise((res) => setTimeout(res, 5000))

        await createNewMember(
          {
            data: {
              handle: formRef.current.handle ?? '',
              captchaToken: formRef.current.captchaToken ?? '',
              allowDownload: true,
              mnemonic: formRef.current.mnemonic ?? '',
              avatar: formRef.current.avatar,
            },
            onError: () => {
              displaySnackbar({
                iconType: 'error',
                title: 'Error during membership creation',
              })
              resetSearchParams()
            },
          },
          async () => {
            await refetchCurrentUser()
            await refetchUserMemberships()
            resetSearchParams()
            displaySnackbar({
              iconType: 'success',
              title: 'Account created!',
            })
          }
        )
      },
    })
  }

  if (!confirmationCode || !email) {
    return null
  }

  return (
    <DialogModal primaryButton={primaryButton} secondaryButton={secondaryButton} show>
      {step === AccountSetupStep.verification ? (
        <EmailVerified onVerified={() => setLoading(false)} code={confirmationCode} />
      ) : null}

      {step === AccountSetupStep.password ? (
        <CreatePassword
          withCaptcha={false}
          defaultValues={formRef.current}
          onSubmit={(data) => {
            setStep(AccountSetupStep.member)
            formRef.current = {
              ...formRef.current,
              ...data,
            }
          }}
          setActionButtonHandler={(fn) => setPrimaryAction(() => fn)}
        />
      ) : null}
      {step === AccountSetupStep.member ? (
        <CreateHandle
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
