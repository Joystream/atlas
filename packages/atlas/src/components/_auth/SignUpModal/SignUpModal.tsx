import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useUserStore } from '@/providers/user/user.store'
import { media } from '@/styles'

import { useCreateMember } from './SignUpModal.hooks'
import { MemberFormData, NewUserFormData, SignUpSteps } from './SignUpModal.types'
import {
  SignUpCreatingMemberStep,
  SignUpEmailStep,
  SignUpMembershipStep,
  SignUpPasswordStep,
  SignUpSeedStep,
  SignUpSuccessStep,
} from './SignUpSteps'
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

    setCurrentStep(0)
  }, [signUpModalOpen, currentStep])

  const [newUserFormData, setNewUserFormData] = useState<NewUserFormData>({
    email: '',
    password: '',
    seed: '',
    handle: '',
    avatar: undefined,
    captchaToken: undefined,
  })
  const createMember = useCreateMember()

  const goToNextStep = useCallback(() => {
    setCurrentStep((previousIdx) => (previousIdx ?? -1) + 1)
    setHasNavigatedBack(false)
  }, [])

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((previousIdx) => (previousIdx ?? 1) - 1)
    setHasNavigatedBack(true)
  }, [])

  const handleEmailChange = useCallback((email: string) => {
    setNewUserFormData((userForm) => ({ ...userForm, email }))
  }, [])

  const handlePasswordChange = useCallback((password: string) => {
    setNewUserFormData((userForm) => ({ ...userForm, password }))
  }, [])

  const handleSeedChange = useCallback((seed: string) => {
    setNewUserFormData((userForm) => ({ ...userForm, seed }))
  }, [])

  const handleMemberFormData = useCallback(
    (data: MemberFormData) => {
      createMember({
        data: { ...newUserFormData, ...data },
        onError: () => goToPreviousStep(),
        onStart: () => goToNextStep(),
        onSuccess: () => goToNextStep(),
      })
    },
    [createMember, goToNextStep, goToPreviousStep, newUserFormData]
  )

  const commonProps: SignUpStepsCommonProps = useMemo(
    () => ({
      setPrimaryButtonProps,
      goToNextStep,
      hasNavigatedBack,
    }),
    [goToNextStep, hasNavigatedBack]
  )
  const backButtonVisible =
    currentStep === SignUpSteps.CreateMember ||
    currentStep === SignUpSteps.SignUpPassword ||
    currentStep === SignUpSteps.SignUpSeed

  const cancelButtonVisible = currentStep !== SignUpSteps.Success && currentStep !== SignUpSteps.Creating
  return (
    <StyledDialogModal
      show={currentStep !== null}
      primaryButton={primaryButtonProps}
      secondaryButton={backButtonVisible ? { text: 'Back', onClick: () => goToPreviousStep() } : undefined}
      confetti={currentStep === SignUpSteps.Success}
      additionalActionsNode={
        cancelButtonVisible ? (
          <Button
            variant="tertiary"
            onClick={() => {
              setSignUpModalOpen(false)
            }}
          >
            Cancel
          </Button>
        ) : undefined
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
      {currentStep === SignUpSteps.CreateMember && (
        <SignUpMembershipStep {...commonProps} onSubmit={handleMemberFormData} />
      )}
      {currentStep === SignUpSteps.Creating && <SignUpCreatingMemberStep {...commonProps} />}
      {currentStep === SignUpSteps.Success && <SignUpSuccessStep />}
    </StyledDialogModal>
  )
}

const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`
