import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import shallow from 'zustand/shallow'

import { GetMembershipsQuery } from '@/api/queries/__generated__/memberships.generated'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { ExternalSignInModalEmailStep } from '@/components/_auth/ExternalSignInModal/ExternalSignInSteps/ExternalSignInModalEmailStep'
import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { useAuthStore } from '@/providers/auth/auth.store'

import { StyledDialogModal } from './ExternalSignInModal.styles'
import {
  ExternalSignInModalMembershipsStep,
  ExternalSignInModalWalletStep,
  ModalSteps,
  SignInStepProps,
} from './ExternalSignInSteps'

export const ExternalSignInModal: FC = () => {
  const [currentStep, setCurrentStep] = useState<ModalSteps>(ModalSteps.Wallet)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null)
  const [availableMemberships, setAvailableMemberships] = useState<GetMembershipsQuery['memberships'] | null>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const form = useForm<{ email: string }>({
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
      })
    ),
  })
  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )

  const goToPreviousStep = useCallback((step: ModalSteps) => {
    setCurrentStep(step)
    setHasNavigatedBack(true)
  }, [])

  // scroll the dialog content to top whenever the displayed step changes
  useEffect(() => {
    if (!dialogContentRef.current) return

    dialogContentRef.current.scrollTo({ top: 0 })
  }, [currentStep])

  const renderStep = () => {
    const commonProps: SignInStepProps = {
      setPrimaryButtonProps,
      goToStep: setCurrentStep,
      hasNavigatedBack,
    }

    switch (currentStep) {
      case ModalSteps.Wallet:
        return <ExternalSignInModalWalletStep {...commonProps} setAvailableMemberships={setAvailableMemberships} />
      case ModalSteps.Membership:
        return (
          <ExternalSignInModalMembershipsStep
            {...commonProps}
            memberships={availableMemberships}
            memberId={selectedMembership}
            setMemberId={setSelectedMembership}
          />
        )
      case ModalSteps.Email:
        return <ExternalSignInModalEmailStep {...commonProps} memberId={selectedMembership} />
      case ModalSteps.Logging:
        return (
          <AuthenticationModalStepTemplate
            title="Logginng in"
            subtitle="Please wait while we log you in. This should take about 10 seconds."
            loader
            hasNavigatedBack={false}
          />
        )
      case ModalSteps.ExtensionSigning:
        return (
          <AuthenticationModalStepTemplate
            title="Waiting for extension"
            subtitle="Please sign the payload with your extension."
            loader
            hasNavigatedBack={false}
          />
        )
      case ModalSteps.NoMembership: {
        return (
          <AuthenticationModalStepTemplate
            title="No memberships connected"
            subtitle="It looks like you don’t have a membership connected to this wallet. Use your email and password to log in."
            hasNavigatedBack={false}
          />
        )
      }
    }
  }

  useEffect(() => {
    if (currentStep === ModalSteps.NoMembership) {
      setPrimaryButtonProps({
        text: 'Use email & password',
        onClick: () => setAuthModalOpenName('logIn'),
      })
    }
  }, [currentStep, setAuthModalOpenName])

  const modalButtons = [ModalSteps.Logging, ModalSteps.ExtensionSigning].includes(currentStep)
    ? {}
    : {
        primaryButton: primaryButtonProps,
        secondaryButton: [ModalSteps.Membership, ModalSteps.NoMembership].includes(currentStep)
          ? { text: 'Back', onClick: () => goToPreviousStep(ModalSteps.Wallet) }
          : [ModalSteps.Wallet, ModalSteps.NoMembership].includes(currentStep)
          ? { text: 'Use email & password', onClick: () => setAuthModalOpenName('logIn') }
          : undefined,
        additionalActionsNode: [ModalSteps.Wallet, ModalSteps.Membership, ModalSteps.Email].includes(currentStep) && (
          <Button
            variant="tertiary"
            onClick={() => {
              setAuthModalOpenName(undefined)
            }}
          >
            Cancel
          </Button>
        ),
      }

  return (
    <StyledDialogModal
      {...modalButtons}
      show={authModalOpenName === 'externalLogIn'}
      additionalActionsNodeMobilePosition="bottom"
      contentRef={dialogContentRef}
    >
      <FormProvider {...form}>{renderStep()}</FormProvider>
    </StyledDialogModal>
  )
}
