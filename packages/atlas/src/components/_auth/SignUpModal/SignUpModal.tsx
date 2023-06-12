import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOverflowDetector } from 'react-detectable-overflow'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { AccountFormData, MemberFormData, RegisterError, useCreateMember } from '@/hooks/useCreateMember'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAuthStore } from '@/providers/auth/auth.store'
import { media } from '@/styles'

import { SignUpSteps } from './SignUpModal.types'
import {
  SignUpCreatingMemberStep,
  SignUpEmailStep,
  SignUpMembershipStep,
  SignUpPasswordStep,
  SignUpSeedStep,
  SignUpSuccessStep,
} from './SignUpSteps'
import { SignUpStepsCommonProps } from './SignUpSteps/SignUpSteps.types'

const SIGNUP_FORM_DATA_INITIAL_STATE: AccountFormData & MemberFormData = {
  email: '',
  password: '',
  mnemonic: '',
  handle: '',
  avatar: undefined,
  captchaToken: undefined,
  confirmedTerms: false,
  confirmedCopy: false,
  memberId: '',
}

export const SignUpModal = () => {
  const [currentStep, setCurrentStep] = useState<SignUpSteps | null>(null)
  const [emailAlreadyTakenError, setEmailAlreadyTakenError] = useState(false)
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Continue' })
  const [amountOfTokens, setAmountofTokens] = useState<number>()
  const [memberId, setMemberId] = useState<string | null>(null)

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

  const [signUpFormData, setSignupFormData] =
    useState<Omit<AccountFormData & MemberFormData, 'memberId'>>(SIGNUP_FORM_DATA_INITIAL_STATE)
  const { createNewMember, createNewOrionAccount } = useCreateMember()

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

  const handleEmailStepSubmit = useCallback(
    (email: string, confirmedTerms: boolean) => {
      setSignupFormData((userForm) => ({ ...userForm, email, confirmedTerms }))
      if (emailAlreadyTakenError && memberId) {
        createNewOrionAccount({
          data: { ...signUpFormData, email, confirmedTerms, memberId },
          onError: (error) => {
            if (error === RegisterError.EmailAlreadyExists) {
              setEmailAlreadyTakenError(true)
              goToStep(SignUpSteps.SignUpEmail)
              return
            }
            goToStep(SignUpSteps.CreateMember)
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
    [createNewOrionAccount, emailAlreadyTakenError, goToNextStep, goToStep, memberId, signUpFormData]
  )

  const handlePasswordStepSubmit = useCallback(
    (password: string) => {
      goToNextStep()
      setSignupFormData((userForm) => ({ ...userForm, password }))
      if (!emailAlreadyTakenError && memberId) {
        createNewOrionAccount({
          data: { ...signUpFormData, password, memberId },
          onError: (error) => {
            if (error === RegisterError.EmailAlreadyExists) {
              setEmailAlreadyTakenError(true)
              goToStep(SignUpSteps.SignUpEmail)
              return
            }
            goToStep(SignUpSteps.CreateMember)
          },
          onStart: () => goToStep(SignUpSteps.Creating),
          onSuccess: (amountOfTokens) => {
            setAmountofTokens(amountOfTokens)
            goToNextStep()
          },
        })
        return
      }
    },
    [createNewOrionAccount, emailAlreadyTakenError, goToNextStep, goToStep, memberId, signUpFormData]
  )

  const handleSeedStepSubmit = useCallback(
    (mnemonic: string, confirmedCopy: boolean) => {
      setSignupFormData((userForm) => ({ ...userForm, mnemonic, confirmedCopy }))
      if (!memberId) {
        createNewMember({
          data: { ...signUpFormData, mnemonic },
          onError: () => {
            goToStep(SignUpSteps.CreateMember)
          },
        }).then((memberId) => {
          if (memberId) {
            setMemberId(memberId)
          }
        })
      }

      goToNextStep()
    },
    [createNewMember, goToNextStep, goToStep, memberId, signUpFormData]
  )

  const handleMemberStepSubmit = useCallback(
    (data: MemberFormData) => {
      goToNextStep()
      setSignupFormData((userForm) => ({ ...userForm, handle: data.handle, avatar: data.avatar }))
    },
    [goToNextStep]
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
    currentStep === SignUpSteps.SignUpEmail ||
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
      {currentStep === SignUpSteps.CreateMember && (
        <SignUpMembershipStep
          {...commonProps}
          dialogContentRef={ref}
          onSubmit={handleMemberStepSubmit}
          avatar={signUpFormData.avatar}
          handle={signUpFormData.handle}
        />
      )}
      {currentStep === SignUpSteps.SignUpSeed && (
        <SignUpSeedStep
          {...commonProps}
          onSeedSubmit={handleSeedStepSubmit}
          mnemonic={signUpFormData.mnemonic}
          confirmedCopy={signUpFormData.confirmedCopy}
        />
      )}
      {currentStep === SignUpSteps.SignUpEmail && (
        <SignUpEmailStep
          {...commonProps}
          isEmailAlreadyTakenError={emailAlreadyTakenError}
          onEmailSubmit={handleEmailStepSubmit}
          email={signUpFormData.email}
          confirmedTerms={signUpFormData.confirmedTerms}
        />
      )}
      {currentStep === SignUpSteps.SignUpPassword && (
        <SignUpPasswordStep
          {...commonProps}
          dialogContentRef={ref}
          onPasswordSubmit={handlePasswordStepSubmit}
          password={signUpFormData.password}
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
