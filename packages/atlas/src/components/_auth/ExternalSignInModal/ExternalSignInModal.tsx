import { FC, useCallback, useEffect, useRef, useState } from 'react'
import shallow from 'zustand/shallow'

import { ExternalSignInModalEmailStep } from '@/components/_auth/ExternalSignInModal/ExternalSignInSteps/ExternalSignInModalEmailStep'
import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useWallet } from '@/providers/wallet/wallet.hooks'

import { StyledDialogModal } from './ExternalSignInModal.styles'
import {
  ExternalSignInModalMembershipsStep,
  ExternalSignInModalWalletStep,
  ModalSteps,
  SignInStepProps,
} from './ExternalSignInSteps'
import { ExternalSignInModalStepTemplate } from './ExternalSignInSteps/ExternalSignInModalStepTemplate'

export const ExternalSignInModal: FC = () => {
  const [currentStep, setCurrentStep] = useState<ModalSteps | null>(null)
  const [cachedStep, setCachedStep] = useState<ModalSteps>(ModalSteps.Wallet) // keep cached step so that we can keep showing content when modal is in exit transition
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const { walletStatus } = useWallet()
  const { signInModalOpen, setSignInModalOpen } = useAuthStore(
    (state) => ({ signInModalOpen: state.signInModalOpen, setSignInModalOpen: state.actions.setSignInModalOpen }),
    shallow
  )
  const walletConnected = walletStatus === 'connected'
  // handle opening/closing of modal and setting initial step
  useEffect(() => {
    if (!signInModalOpen) {
      setCurrentStep(null)
      return
    }
    if (currentStep !== null) return

    if (walletConnected) {
      setCurrentStep(ModalSteps.Membership)
      return
    }
    setCurrentStep(ModalSteps.Wallet)
  }, [signInModalOpen, currentStep, walletConnected])

  // keep cachedStepIdx updated
  useEffect(() => {
    if (currentStep != null) {
      setCachedStep(currentStep)
    }
  }, [currentStep])

  const goToPreviousStep = useCallback((step: ModalSteps) => {
    setCurrentStep(step)
    setHasNavigatedBack(true)
  }, [])

  const displayedStep = currentStep || cachedStep

  // scroll the dialog content to top whenever the displayed step changes
  useEffect(() => {
    if (!dialogContentRef.current) return

    dialogContentRef.current.scrollTo({ top: 0 })
  }, [displayedStep])

  const renderStep = () => {
    const commonProps: SignInStepProps = {
      setPrimaryButtonProps,
      goToStep: setCurrentStep,
      hasNavigatedBack,
    }

    switch (displayedStep) {
      case ModalSteps.Wallet:
        return <ExternalSignInModalWalletStep {...commonProps} />
      case ModalSteps.Membership:
        return (
          <ExternalSignInModalMembershipsStep
            {...commonProps}
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
    }
  }

  const modalButtons =
    displayedStep === ModalSteps.Logging
      ? {}
      : {
          primaryButton: primaryButtonProps,
          secondaryButton:
            displayedStep === ModalSteps.Membership
              ? { text: 'Back', onClick: () => goToPreviousStep(ModalSteps.Wallet) }
              : displayedStep === ModalSteps.Wallet
              ? { text: 'Use email & password' }
              : undefined,
          additionalActionsNode: (
            <Button
              variant="tertiary"
              onClick={() => {
                setSignInModalOpen(false)
              }}
            >
              Cancel
            </Button>
          ),
        }

  return (
    <StyledDialogModal
      {...modalButtons}
      show={!!currentStep}
      dividers
      additionalActionsNodeMobilePosition="bottom"
      contentRef={dialogContentRef}
    >
      {renderStep()}
    </StyledDialogModal>
  )
}
