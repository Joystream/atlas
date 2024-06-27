import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import shallow from 'zustand/shallow'

import { GetMembershipsQuery } from '@/api/queries/__generated__/memberships.generated'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { registerAccount } from '@/providers/auth/auth.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'

import { AuthenticationModalStepTemplate } from '../AuthenticationModalStepTemplate'
import {
  ExternalSignInModalMembershipsStep,
  ExternalSignInModalWalletStep,
} from '../ExternalSignInModal/ExternalSignInSteps'
import { EmailVerified } from '../genericSteps/EmailVerified'
import { WaitingModal } from '../genericSteps/WaitingModal'

enum ExternalAccountSetupStep {
  Verification = 'Verification',
  Wallet = 'Wallet',
  Membership = 'Membership',
  NoMembership = 'NoMembership',
  ExtensionSigning = 'ExtensionSigning',
}

export const ExternalAccountSetup = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { handleLogin } = useAuth()
  const { joystream } = useJoystream()
  const { setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Verifying...' }) // start with sensible default so that there are no jumps after first effect runs
  const [availableMemberships, setAvailableMemberships] = useState<GetMembershipsQuery['memberships'] | null>(null)
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null)
  const confirmationCode = decodeURIComponent(searchParams.get('email-token') ?? '') // 5y6WUaZ5IxAGf4iLGarc1OHFHBWScJZ4/gxWGn4trq4=
  const email = decodeURIComponent(searchParams.get('email') ?? '')
  const [step, setStep] = useState(ExternalAccountSetupStep.Verification)
  const [loading, setLoading] = useState(true)
  const { displaySnackbar } = useSnackbar()

  const resetSearchParams = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])

  useEffect(() => {
    if (step === ExternalAccountSetupStep.Verification) {
      setPrimaryButtonProps({
        text: loading ? 'Verifying...' : 'Create an account',
        onClick: () => setStep(ExternalAccountSetupStep.Wallet),
        disabled: loading,
      })
    }

    if (step === ExternalAccountSetupStep.ExtensionSigning) {
      return setPrimaryButtonProps({
        text: 'Waiting...',
        onClick: undefined,
        disabled: true,
      })
    }
  }, [loading, step])

  const handleConfirm = useCallback(async () => {
    const account = await joystream?.selectedAccountId
    if (!joystream?.signMessage || !account || !email || !confirmationCode) return
    const userAddress = typeof account === 'object' ? account.address : account
    setStep(ExternalAccountSetupStep.ExtensionSigning)

    try {
      const address = await registerAccount({
        type: 'external',
        email: email,
        address: userAddress,
        signature: (data) =>
          joystream?.signMessage({
            type: 'payload',
            data,
          }),
        emailConfimationToken: confirmationCode,
      })

      if (address) {
        await handleLogin({
          type: 'external',
          address,
          sign: (data) =>
            joystream?.signMessage({
              type: 'payload',
              data,
            }),
        })
      }
      setAuthModalOpenName(undefined)
      resetSearchParams()
    } catch (error) {
      if (error.message.includes('Token not found. Possibly expired or already used.')) {
        displaySnackbar({
          iconType: 'error',
          title: 'Token expired',
          description: 'Please try again to generate a new one, if the problem persists contact support.',
        })
        resetSearchParams()
        return
      }
      displaySnackbar({
        iconType: 'error',
        title: 'Something went wrong',
        description: 'Please try again, if the problem persists contact support.',
      })
    }
  }, [confirmationCode, displaySnackbar, email, handleLogin, joystream, resetSearchParams, setAuthModalOpenName])

  if (!confirmationCode || !email) {
    return null
  }

  return (
    <DialogModal
      primaryButton={primaryButtonProps}
      secondaryButton={{
        text: 'Cancel',
        onClick: () => resetSearchParams(),
      }}
      show
    >
      {step === ExternalAccountSetupStep.Verification ? (
        <EmailVerified onVerified={() => setLoading(false)} code={confirmationCode} />
      ) : null}

      {step === ExternalAccountSetupStep.Wallet ? (
        <ExternalSignInModalWalletStep
          goToStep={(val) => setStep(val as ExternalAccountSetupStep)}
          hasNavigatedBack={false}
          setPrimaryButtonProps={setPrimaryButtonProps}
          setAvailableMemberships={setAvailableMemberships}
        />
      ) : null}

      {step === ExternalAccountSetupStep.Membership ? (
        <ExternalSignInModalMembershipsStep
          hasNavigatedBack={false}
          setPrimaryButtonProps={setPrimaryButtonProps}
          memberships={availableMemberships}
          goToStep={(val) => setStep(val as ExternalAccountSetupStep)}
          memberId={selectedMembership}
          setMemberId={setSelectedMembership}
          handleNoAccount={handleConfirm}
        />
      ) : null}

      {step === ExternalAccountSetupStep.ExtensionSigning ? (
        <WaitingModal title="Waiting for extension" description="Please sign the payload with your extension." />
      ) : null}

      {step === ExternalAccountSetupStep.NoMembership ? (
        <AuthenticationModalStepTemplate
          title="No memberships connected"
          subtitle="It looks like you don’t have a membership connected to this wallet. Use your email and password to sign in."
          hasNavigatedBack={false}
        />
      ) : null}
    </DialogModal>
  )
}
