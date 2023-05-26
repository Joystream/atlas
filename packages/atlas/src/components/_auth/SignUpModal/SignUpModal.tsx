import styled from '@emotion/styled'
import { Ref, useCallback, useEffect, useMemo, useState } from 'react'
import { useOverflowDetector } from 'react-detectable-overflow'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUserStore } from '@/providers/user/user.store'
import { media } from '@/styles'

import { useCreateMember } from './SignUpModal.hooks'
import { MemberFormData, SignUpFormData, SignUpSteps } from './SignUpModal.types'
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
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Continue' })

  const { signUpModalOpen, setSignUpModalOpen } = useUserStore(
    (state) => ({ signUpModalOpen: state.signUpModalOpen, setSignUpModalOpen: state.actions.setSignUpModalOpen }),
    shallow
  )
  const { ref, overflow } = useOverflowDetector({})

  // handle opening/closing of modal and setting initial step
  useEffect(() => {
    if (!signUpModalOpen) {
      setCurrentStep(null)
      return
    }
    if (currentStep != null) return

    setCurrentStep(0)
  }, [signUpModalOpen, currentStep])

  const [signUpFormData, setSignupFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    seed: '',
    handle: '',
    avatar: undefined,
    captchaToken: undefined,
    confirmedTerms: false,
    confirmedCopy: false,
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

  const handleEmailChange = useCallback(
    (email: string, confirmedTerms: boolean) => {
      goToNextStep()
      setSignupFormData((userForm) => ({ ...userForm, email, confirmedTerms }))
    },
    [goToNextStep]
  )

  const handlePasswordChange = useCallback(
    (password: string) => {
      goToNextStep()
      setSignupFormData((userForm) => ({ ...userForm, password }))
    },
    [goToNextStep]
  )

  const handleSeedChange = useCallback(
    (seed: string, confirmedCopy: boolean) => {
      goToNextStep()
      setSignupFormData((userForm) => ({ ...userForm, seed, confirmedCopy }))
    },
    [goToNextStep]
  )

  const handleMemberFormData = useCallback(
    (data: MemberFormData) => {
      setSignupFormData((userForm) => ({ ...userForm, handle: data.handle, avatar: data.avatar }))
      createMember({
        data: { ...signUpFormData, ...data },
        onError: () => goToPreviousStep(),
        onStart: () => goToNextStep(),
        onSuccess: () => goToNextStep(),
      })
    },
    [createMember, goToNextStep, goToPreviousStep, signUpFormData]
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
  const isSuccess = currentStep === SignUpSteps.Success

  const smMatch = useMediaMatch('sm')

  return (
    <StyledDialogModal
      show={currentStep !== null}
      dividers={overflow || !smMatch}
      primaryButton={
        isSuccess
          ? {
              text: 'Continue',
              onClick: () => {
                setSignUpModalOpen(false)
              },
            }
          : primaryButtonProps
      }
      secondaryButton={backButtonVisible ? { text: 'Back', onClick: () => goToPreviousStep() } : undefined}
      confetti={currentStep === SignUpSteps.Success && !smMatch}
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
      contentRef={ref as Ref<HTMLDivElement>}
    >
      {currentStep === SignUpSteps.SignUpEmail && (
        <SignUpEmailStep
          {...commonProps}
          onEmailSubmit={handleEmailChange}
          email={signUpFormData.email}
          confirmedTerms={signUpFormData.confirmedTerms}
        />
      )}
      {currentStep === SignUpSteps.SignUpPassword && (
        <SignUpPasswordStep
          {...commonProps}
          onPasswordSubmit={handlePasswordChange}
          password={signUpFormData.password}
        />
      )}
      {currentStep === SignUpSteps.SignUpSeed && (
        <SignUpSeedStep
          {...commonProps}
          onSeedSubmit={handleSeedChange}
          seed={signUpFormData.seed}
          confirmedCopy={signUpFormData.confirmedCopy}
        />
      )}
      {currentStep === SignUpSteps.CreateMember && (
        <SignUpMembershipStep
          {...commonProps}
          onSubmit={handleMemberFormData}
          avatar={signUpFormData.avatar}
          handle={signUpFormData.handle}
        />
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
