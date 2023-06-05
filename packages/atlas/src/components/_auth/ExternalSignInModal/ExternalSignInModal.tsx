import { FC, useCallback, useEffect, useRef, useState } from 'react'
import shallow from 'zustand/shallow'

import { GetMembershipsQuery } from '@/api/queries/__generated__/memberships.generated'
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
import { ExternalSignInModalStepTemplate } from './ExternalSignInSteps/ExternalSignInModalStepTemplate'

export const ExternalSignInModal: FC = () => {
  const [currentStep, setCurrentStep] = useState<ModalSteps>(ModalSteps.Wallet)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null)
  const [availableMemberships, setAvailableMemberships] = useState<GetMembershipsQuery['memberships'] | null>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const { authModalOpen, setAuthModalOpen } = useAuthStore(
    (state) => ({ authModalOpen: state.authModalOpen, setAuthModalOpen: state.actions.setAuthModalOpen }),
    shallow
  )

  const goToPreviousStep = useCallback((step: ModalSteps) => {
    setCurrentStep(step)
    setHasNavigatedBack(true)
  }, [])

  useEffect(() => {
    if (!authModalOpen) {
      setCurrentStep(ModalSteps.Wallet)
      setAvailableMemberships([])
    }
  }, [authModalOpen])

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
          <ExternalSignInModalStepTemplate
            title="Logginng in"
            subtitle="Please wait while we log you in. This should take about 10 seconds."
            loader
            hasNavigatedBack={false}
          />
        )
      case ModalSteps.ExtensionSigning:
        return (
          <ExternalSignInModalStepTemplate
            title="Waiting for extension"
            subtitle="Please sign the payload with your extension."
            loader
            hasNavigatedBack={false}
          />
        )
      case ModalSteps.NoMembership: {
        return (
          <ExternalSignInModalStepTemplate
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
        onClick: () => setAuthModalOpen('logIn'),
      })
    }
  }, [currentStep, setAuthModalOpen])

  const modalButtons =
    currentStep === ModalSteps.Logging
      ? {}
      : {
          primaryButton: primaryButtonProps,
          secondaryButton: [ModalSteps.Membership, ModalSteps.NoMembership].includes(currentStep)
            ? { text: 'Back', onClick: () => goToPreviousStep(ModalSteps.Wallet) }
            : [ModalSteps.Wallet, ModalSteps.NoMembership].includes(currentStep)
            ? { text: 'Use email & password', onClick: () => setAuthModalOpen('logIn') }
            : undefined,
          additionalActionsNode: (
            <Button
              variant="tertiary"
              onClick={() => {
                setAuthModalOpen(undefined)
              }}
            >
              Cancel
            </Button>
          ),
        }

  return (
    <StyledDialogModal
      {...modalButtons}
      show={authModalOpen === 'externalLogIn'}
      dividers={currentStep !== ModalSteps.NoMembership}
      additionalActionsNodeMobilePosition="bottom"
      contentRef={dialogContentRef}
    >
      {renderStep()}
    </StyledDialogModal>
  )
}
