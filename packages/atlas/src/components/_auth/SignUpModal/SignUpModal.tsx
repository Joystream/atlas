import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOverflowDetector } from 'react-detectable-overflow'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { AccountFormData, MemberFormData, RegisterError, useCreateMember } from '@/hooks/useCreateMember'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useUniqueMemberHandle } from '@/hooks/useUniqueMemberHandle'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { media } from '@/styles'
import { createId } from '@/utils/createId'
import { imageUrlToBlob } from '@/utils/image'

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

const stepToPageName: Partial<Record<SignUpSteps, string>> = {
  [SignUpSteps.SignUpSeed]: 'YPP Seed modal',
  [SignUpSteps.SignUpPassword]: 'YPP Password modal',
  [SignUpSteps.SignUpEmail]: 'YPP Email modal',
}

export const SignUpModal = () => {
  const [currentStep, setCurrentStep] = useState<SignUpSteps>(0)
  const [emailAlreadyTakenError, setEmailAlreadyTakenError] = useState(false)
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Continue' })
  const [amountOfTokens, setAmountofTokens] = useState<number>()
  const [memberId, setMemberId] = useState<string | null>(null)

  const ytResponseData = useYppStore((state) => state.ytResponseData)
  const setYppModalOpenName = useYppStore((state) => state.actions.setYppModalOpenName)
  const setYtResponseData = useYppStore((state) => state.actions.setYtResponseData)

  const { generateUniqueMemberHandleBasedOnInput } = useUniqueMemberHandle()
  const { trackMembershipCreation } = useSegmentAnalytics()

  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const { ref, overflow } = useOverflowDetector<HTMLDivElement>({})

  const [signUpFormData, setSignupFormData] =
    useState<Omit<AccountFormData & MemberFormData, 'memberId'>>(SIGNUP_FORM_DATA_INITIAL_STATE)
  const { createNewMember, createNewOrionAccount } = useCreateMember()
  const { trackPageView } = useSegmentAnalytics()

  const goToNextStep = useCallback(() => {
    setCurrentStep((previousIdx) => (previousIdx ?? -1) + 1)
    setHasNavigatedBack(false)
  }, [])

  const isYppFlow = ytResponseData !== null

  // skip the membership step when signing to ypp(ypp flow will provide handle and avatar for membership automatically)
  useEffect(() => {
    if (isYppFlow && stepToPageName[currentStep]) {
      setCurrentStep(SignUpSteps.SignUpSeed)
    }
  }, [currentStep, isYppFlow])

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

      if (memberId) {
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
          onSuccess: ({ amountOfTokens }) => {
            // if this is ypp flow, overwrite ytResponseData.email
            if (ytResponseData) {
              setYtResponseData({ ...ytResponseData, email })
              setAuthModalOpenName(undefined)
              setYppModalOpenName('ypp-sync-options')
            } else {
              setAmountofTokens(amountOfTokens)
              goToNextStep()
            }
          },
        })
        return
      }
      goToNextStep()
    },
    [
      createNewOrionAccount,
      goToNextStep,
      goToStep,
      memberId,
      setAuthModalOpenName,
      setYppModalOpenName,
      setYtResponseData,
      signUpFormData,
      ytResponseData,
    ]
  )

  const handlePasswordStepSubmit = useCallback(
    async (password: string) => {
      goToNextStep()
      setSignupFormData((userForm) => ({ ...userForm, password }))
    },
    [goToNextStep]
  )

  const handleCreateMemberOnSeedStepSubmit = useCallback(
    async (mnemonic: string, confirmedCopy: boolean) => {
      let handle = signUpFormData.handle
      let blob = signUpFormData.avatar?.blob

      if (ytResponseData) {
        // replace handle and avatar if they are provided via ypp flow
        blob = ytResponseData.avatarUrl ? await imageUrlToBlob(ytResponseData.avatarUrl) : null
        handle = ytResponseData.channelHandle
          ? await generateUniqueMemberHandleBasedOnInput(ytResponseData.channelHandle)
          : `user${createId()}`
      }

      const memberData = {
        mnemonic,
        handle,
        confirmedCopy,
        avatar: blob ? { blob } : undefined,
      }

      setSignupFormData((userForm) => ({
        ...userForm,
        ...memberData,
      }))

      // don't create another member if user already created a member and click back on the password step
      if (memberId) {
        goToNextStep()
        return
      }

      goToNextStep()
      const newMemberId = await createNewMember({
        data: { ...signUpFormData, ...memberData },
        onError: () => {
          goToStep(SignUpSteps.CreateMember)
        },
      })

      if (newMemberId) {
        setMemberId(newMemberId)
      }
    },
    [
      createNewMember,
      generateUniqueMemberHandleBasedOnInput,
      goToNextStep,
      goToStep,
      memberId,
      signUpFormData,
      ytResponseData,
    ]
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
  const backButtonVisible = useMemo(() => {
    if (currentStep === SignUpSteps.SignUpSeed && ytResponseData) {
      return false
    }
    return (
      currentStep === SignUpSteps.SignUpEmail ||
      currentStep === SignUpSteps.SignUpPassword ||
      currentStep === SignUpSteps.SignUpSeed
    )
  }, [currentStep, ytResponseData])

  const cancelButtonVisible = currentStep !== SignUpSteps.Success && currentStep !== SignUpSteps.Creating
  const isSuccess = currentStep === SignUpSteps.Success

  useEffect(() => {
    if (isSuccess) {
      trackMembershipCreation(signUpFormData.handle, signUpFormData.email)
    }
  }, [isSuccess, signUpFormData.email, signUpFormData.handle, trackMembershipCreation])

  useEffect(() => {
    if (isYppFlow && Boolean(stepToPageName[currentStep])) {
      trackPageView(stepToPageName[currentStep] ?? '')
    }
  }, [currentStep, isYppFlow, trackPageView])

  const smMatch = useMediaMatch('sm')
  return (
    <StyledDialogModal
      disableBackdropAnimation
      show={authModalOpenName === 'signUp'}
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
          onSeedSubmit={handleCreateMemberOnSeedStepSubmit}
          mnemonic={signUpFormData.mnemonic}
          confirmedCopy={signUpFormData.confirmedCopy}
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

      {currentStep === SignUpSteps.SignUpEmail && (
        <SignUpEmailStep
          {...commonProps}
          isOverflowing={overflow || !smMatch}
          isEmailAlreadyTakenError={emailAlreadyTakenError}
          onEmailSubmit={handleEmailStepSubmit}
          email={signUpFormData.email}
          confirmedTerms={signUpFormData.confirmedTerms}
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
