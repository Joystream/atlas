import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOverflowDetector } from 'react-detectable-overflow'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAuthStore } from '@/providers/auth/auth.store'
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

const SIGNUP_FORM_DATA_INITIAL_STATE = {
  email: '',
  password: '',
  mnemonic: '',
  handle: '',
  avatar: undefined,
  captchaToken: undefined,
  confirmedTerms: false,
  confirmedCopy: false,
}

export const SignUpModal = () => {
  const [currentStep, setCurrentStep] = useState<SignUpSteps | null>(null)
  const [emailAlreadyTakenError, setEmailAlreadyTakenError] = useState(false)
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Continue' })
  const [amountOfTokens, setAmountofTokens] = useState<number>()

  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const { ref, overflow } = useOverflowDetector<HTMLDivElement>({})

  // handle opening/closing of modal and setting initial step
  useEffect(() => {
    if (authModalOpenName !== 'signUp') {
      setCurrentStep(null)
      return
    }
    if (currentStep != null) return

    setCurrentStep(0)
  }, [currentStep, authModalOpenName])

  const [signUpFormData, setSignupFormData] = useState<SignUpFormData>(SIGNUP_FORM_DATA_INITIAL_STATE)
  const createMember = useCreateMember()

  const goToNextStep = useCallback(() => {
    setCurrentStep((previousIdx) => (previousIdx ?? -1) + 1)
    setHasNavigatedBack(false)
  }, [])

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((previousIdx) => (previousIdx ?? 1) - 1)
    setHasNavigatedBack(true)
  }, [])

  const goToStep = useCallback(
    (step: SignUpSteps) => {
      if (currentStep && currentStep < step) {
        setHasNavigatedBack(true)
      }
      setCurrentStep(step)
    },
    [currentStep]
  )

  const handleEmailChange = useCallback(
    (email: string, confirmedTerms: boolean) => {
      setSignupFormData((userForm) => ({ ...userForm, email, confirmedTerms }))
      if (emailAlreadyTakenError) {
        createMember({
          data: { ...signUpFormData, email, confirmedTerms },
          onError: (step) => {
            goToStep(step)
            if (step === SignUpSteps.SignUpEmail) setEmailAlreadyTakenError(true)
          },
          onStart: () => goToStep(SignUpSteps.Creating),
          onSuccess: (amountOfTokens) => {
            setAmountofTokens(amountOfTokens)
            goToNextStep()
          },
        })
        return
      }
      goToNextStep()
    },
    [createMember, emailAlreadyTakenError, goToNextStep, goToStep, signUpFormData]
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
      setSignupFormData((userForm) => ({ ...userForm, mnemonic: seed, confirmedCopy }))
    },
    [goToNextStep]
  )

  const handleMemberFormData = useCallback(
    (data: MemberFormData) => {
      setSignupFormData((userForm) => ({ ...userForm, handle: data.handle, avatar: data.avatar }))
      createMember({
        data: { ...signUpFormData, ...data },
        onError: (step) => {
          goToStep(step)
          setEmailAlreadyTakenError(true)
        },
        onStart: () => goToNextStep(),
        onSuccess: (amountOfTokens) => {
          setAmountofTokens(amountOfTokens)
          goToNextStep()
        },
      })
    },
    [createMember, goToNextStep, goToStep, signUpFormData]
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
                setSignupFormData(SIGNUP_FORM_DATA_INITIAL_STATE)
                setAuthModalOpenName(undefined)
              },
            }
          : primaryButtonProps
      }
      secondaryButton={backButtonVisible ? { text: 'Back', onClick: () => goToPreviousStep() } : undefined}
      confetti={currentStep === SignUpSteps.Success && smMatch}
      additionalActionsNode={
        cancelButtonVisible ? (
          <Button
            variant="tertiary"
            onClick={() => {
              setAuthModalOpenName(undefined)
              setSignupFormData(SIGNUP_FORM_DATA_INITIAL_STATE)
            }}
          >
            Cancel
          </Button>
        ) : undefined
      }
      additionalActionsNodeMobilePosition="bottom"
      contentRef={ref}
    >
      {currentStep === SignUpSteps.SignUpEmail && (
        <SignUpEmailStep
          {...commonProps}
          isEmailAlreadyTakenError={emailAlreadyTakenError}
          onEmailSubmit={handleEmailChange}
          email={signUpFormData.email}
          confirmedTerms={signUpFormData.confirmedTerms}
        />
      )}
      {currentStep === SignUpSteps.SignUpPassword && (
        <SignUpPasswordStep
          {...commonProps}
          dialogContentRef={ref}
          onPasswordSubmit={handlePasswordChange}
          password={signUpFormData.password}
        />
      )}
      {currentStep === SignUpSteps.SignUpSeed && (
        <SignUpSeedStep
          {...commonProps}
          onSeedSubmit={handleSeedChange}
          mnemonic={signUpFormData.mnemonic}
          confirmedCopy={signUpFormData.confirmedCopy}
        />
      )}
      {currentStep === SignUpSteps.CreateMember && (
        <SignUpMembershipStep
          {...commonProps}
          dialogContentRef={ref}
          onSubmit={handleMemberFormData}
          avatar={signUpFormData.avatar}
          handle={signUpFormData.handle}
        />
      )}
      {currentStep === SignUpSteps.Creating && <SignUpCreatingMemberStep {...commonProps} />}
      {currentStep === SignUpSteps.Success && (
        <SignUpSuccessStep avatarUrl={signUpFormData.avatar?.url || ''} amountOfTokens={amountOfTokens} />
      )}
    </StyledDialogModal>
  )
}

const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`
