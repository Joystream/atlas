import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useRegister } from '@/hooks/useRegister'
import { useUserStore } from '@/providers/user/user.store'
import { media } from '@/styles'

import { SignUpSteps } from './SignUpModal.types'
import { SignUpEmailStep, SignUpPasswordStep, SignUpSeedStep } from './SignUpSteps'
import { SignUpStepsCommonProps } from './SignUpSteps/SignUpSteps.types'

export const SignUpModal = () => {
  const [currentStep, setCurrentStep] = useState<SignUpSteps | null>(null)
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Continue' })

  const { signUpModalOpen, setSignUpModalOpen } = useUserStore(
    (state) => ({ signUpModalOpen: state.signUpModalOpen, setSignUpModalOpen: state.actions.setSignUpModalOpen }),
    shallow
  )

  // handle opening/closing of modal and setting initial step
  useEffect(() => {
    if (!signUpModalOpen) {
      setCurrentStep(null)
      return
    }
    if (currentStep != null) return

    setCurrentStep(SignUpSteps.SignUpEmail)
  }, [signUpModalOpen, currentStep])

  const [userForm, setUserForm] = useState<{
    email: string
    password: string
    seed: string
  }>({
    email: '',
    password: '',
    seed: '',
  })
  const handleRegister = useRegister()

  const goToNextStep = useCallback(() => {
    setCurrentStep((previousIdx) => (previousIdx ?? -1) + 1)
    setHasNavigatedBack(false)
  }, [])

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((previousIdx) => (previousIdx ?? 1) - 1)
    setHasNavigatedBack(true)
  }, [])

  const handleEmailChange = useCallback((email: string) => {
    setUserForm((userForm) => ({ ...userForm, email }))
  }, [])

  const handlePasswordChange = useCallback((password: string) => {
    setUserForm((userForm) => ({ ...userForm, password }))
  }, [])

  const handleSeedChange = useCallback(
    (seed: string) => {
      setUserForm((userForm) => ({ ...userForm, seed }))
      handleRegister(userForm.email, userForm.password, seed)
    },
    [handleRegister, userForm.email, userForm.password]
  )

  const commonProps: SignUpStepsCommonProps = useMemo(
    () => ({
      setPrimaryButtonProps,
      goToNextStep,
      hasNavigatedBack,
    }),
    [goToNextStep, hasNavigatedBack]
  )

  return (
    <StyledDialogModal
      show={currentStep !== null}
      primaryButton={primaryButtonProps}
      secondaryButton={{ text: 'Back', onClick: () => goToPreviousStep() }}
      additionalActionsNode={
        <Button
          variant="tertiary"
          onClick={() => {
            setSignUpModalOpen(false)
          }}
        >
          Cancel
        </Button>
      }
      additionalActionsNodeMobilePosition="bottom"
      contentRef={dialogContentRef}
    >
      {currentStep === SignUpSteps.SignUpEmail && (
        <SignUpEmailStep {...commonProps} onEmailSubmit={handleEmailChange} />
      )}
      {currentStep === SignUpSteps.SignUpPassword && (
        <SignUpPasswordStep {...commonProps} onPasswordSubmit={handlePasswordChange} />
      )}
      {currentStep === SignUpSteps.SignUpSeed && <SignUpSeedStep {...commonProps} onSeedSubmit={handleSeedChange} />}
    </StyledDialogModal>
  )
}

const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`
