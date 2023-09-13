import styled from '@emotion/styled'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useOverflowDetector } from 'react-detectable-overflow'
import shallow from 'zustand/shallow'

import { useGetMembershipsLazyQuery } from '@/api/queries/__generated__/memberships.generated'
import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { AccountFormData, FaucetError, MemberFormData, RegisterError, useCreateMember } from '@/hooks/useCreateMember'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useUniqueMemberHandle } from '@/hooks/useUniqueMemberHandle'
import { handleAnonymousAuth } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useSnackbar } from '@/providers/snackbars'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { media } from '@/styles'
import { createId } from '@/utils/createId'
import { imageUrlToBlob } from '@/utils/image'
import { SentryLogger } from '@/utils/logs'

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
  [SignUpSteps.CreateMember]: 'Sign up modal - create member',
  [SignUpSteps.SignUpSeed]: 'Signup modal - seed',
  [SignUpSteps.SignUpPassword]: 'Signup modal - password',
  [SignUpSteps.SignUpEmail]: 'Signup modal - email',
  [SignUpSteps.Creating]: 'Signup modal - creating account',
  [SignUpSteps.Success]: 'Signup modal - success',
}

export const SignUpModal = () => {
  const [currentStep, setCurrentStep] = useState<SignUpSteps>(0)
  const [emailAlreadyTakenError, setEmailAlreadyTakenError] = useState(false)
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Continue' })
  const [amountOfTokens, setAmountofTokens] = useState<number>()
  const memberRef = useRef<string | null>(null)
  const memberPollingTries = useRef(0)
  const haveTriedCreateSession = useRef(false)
  const ytResponseData = useYppStore((state) => state.ytResponseData)
  const setYppModalOpenName = useYppStore((state) => state.actions.setYppModalOpenName)
  const setYtResponseData = useYppStore((state) => state.actions.setYtResponseData)
  const { anonymousUserId } = useAuthStore()
  const { displaySnackbar } = useSnackbar()

  const { generateUniqueMemberHandleBasedOnInput } = useUniqueMemberHandle()

  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const { ref, overflow } = useOverflowDetector<HTMLDivElement>({})

  const signUpFormData = useRef<Omit<AccountFormData & MemberFormData, 'memberId'>>(SIGNUP_FORM_DATA_INITIAL_STATE)
  const { createNewMember, createNewOrionAccount } = useCreateMember()
  const { trackPageView, trackMembershipCreation } = useSegmentAnalytics()

  const goToNextStep = useCallback(() => {
    setCurrentStep((previousIdx) => (previousIdx ?? -1) + 1)
    setHasNavigatedBack(false)
  }, [])

  const isYppFlow = ytResponseData !== null

  // skip the membership step when signing to ypp(ypp flow will provide handle and avatar for membership automatically)
  useEffect(() => {
    if (isYppFlow) {
      setCurrentStep(SignUpSteps.SignUpSeed)
    }
  }, [isYppFlow])

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

  const handleOrionAccountCreation = useCallback(() => {
    if (!memberRef.current) {
      return
    }

    return createNewOrionAccount({
      data: { ...signUpFormData.current, memberId: memberRef.current },
      onError: (error) => {
        if (error === RegisterError.EmailAlreadyExists) {
          setEmailAlreadyTakenError(true)
          goToStep(SignUpSteps.SignUpEmail)
          return
        }
        if (error === RegisterError.MembershipNotFound) {
          SentryLogger.error('Failed to create an account - missing membership', 'SignUpModal', error)
          displaySnackbar({
            title: 'Something went wrong',
            description: 'We could not find your membership. Please contact support.',
            iconType: 'error',
          })
          setAuthModalOpenName(undefined)
        }
        if (error === RegisterError.SessionRequired) {
          if (!haveTriedCreateSession.current) {
            haveTriedCreateSession.current = true
            handleAnonymousAuth(anonymousUserId).then(() => {
              handleOrionAccountCreation()
            })
          } else {
            displaySnackbar({
              title: 'Something went wrong',
              description: 'We could not create or find session. Please contact support.',
              iconType: 'error',
            })
            setAuthModalOpenName(undefined)
          }
        }
      },
      onStart: () => {
        goToStep(SignUpSteps.Creating)
      },
      onSuccess: ({ amountOfTokens }) => {
        // if this is ypp flow, overwrite ytResponseData.email
        if (ytResponseData) {
          setYtResponseData({ ...ytResponseData, email: signUpFormData.current.email })
          setAuthModalOpenName(undefined)
          setYppModalOpenName('ypp-sync-options')
        } else {
          setAmountofTokens(amountOfTokens)
          goToNextStep()
        }
      },
    })
  }, [
    anonymousUserId,
    createNewOrionAccount,
    displaySnackbar,
    goToNextStep,
    goToStep,
    setAuthModalOpenName,
    setYppModalOpenName,
    setYtResponseData,
    ytResponseData,
  ])

  const [getMembership, { startPolling }] = useGetMembershipsLazyQuery({
    onCompleted: (data) => {
      if (!data.memberships[0].id) {
        if (memberPollingTries.current > 5) {
          handleOrionAccountCreation()
        }
        memberPollingTries.current++
        return
      }
      handleOrionAccountCreation()
    },
  })

  const handleEmailStepSubmit = useCallback(
    (email: string, confirmedTerms: boolean) => {
      signUpFormData.current = { ...signUpFormData.current, email, confirmedTerms }
      if (memberRef.current && emailAlreadyTakenError) {
        handleOrionAccountCreation()
        return
      }

      goToNextStep()
    },
    [emailAlreadyTakenError, goToNextStep, handleOrionAccountCreation]
  )

  const handlePasswordStepSubmit = useCallback(
    async (password: string) => {
      signUpFormData.current = { ...signUpFormData.current, password }
      const memberId = await createNewMember({
        data: {
          ...signUpFormData.current,
          authorizationCode: ytResponseData?.authorizationCode,
          userId: ytResponseData?.userId,
        },
        onStart: () => {
          goToStep(SignUpSteps.Creating)
        },
        onError: (error) => {
          if (error === FaucetError.MemberAlreadyCreatedForGoogleAccount) {
            setAuthModalOpenName(undefined)
          } else {
            goToStep(SignUpSteps.CreateMember)
          }
        },
      })
      if (memberId) {
        memberRef.current = memberId ?? null
        getMembership({
          variables: {
            where: {
              id_eq: memberId,
            },
          },
        })
        startPolling(10_000)
      }
    },
    [
      createNewMember,
      getMembership,
      goToStep,
      setAuthModalOpenName,
      startPolling,
      ytResponseData?.authorizationCode,
      ytResponseData?.userId,
    ]
  )

  const handleCreateMemberOnSeedStepSubmit = useCallback(
    async (mnemonic: string, confirmedCopy: boolean) => {
      let handle = signUpFormData.current.handle
      let blob = signUpFormData.current.avatar?.blob

      if (ytResponseData) {
        // replace handle and avatar if they are provided via ypp flow
        blob = ytResponseData.avatarUrl
          ? (await imageUrlToBlob(ytResponseData.avatarUrl).catch((err) =>
              SentryLogger.error('Failed to process YT avatar image', 'handleCreateOrUpdateChannel', err)
            )) ?? null
          : null
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

      signUpFormData.current = {
        ...signUpFormData.current,
        ...memberData,
      }

      goToNextStep()
    },
    [ytResponseData, goToNextStep, generateUniqueMemberHandleBasedOnInput]
  )

  const handleMemberStepSubmit = useCallback(
    (data: MemberFormData) => {
      goToNextStep()
      signUpFormData.current = {
        ...signUpFormData.current,
        handle: data.handle,
        avatar: data.avatar,
        captchaToken: data.captchaToken,
      }
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
      return undefined
    }

    if (currentStep === SignUpSteps.CreateMember) {
      return { text: 'Back', onClick: () => setAuthModalOpenName('logIn') }
    }

    if (
      currentStep === SignUpSteps.SignUpEmail ||
      currentStep === SignUpSteps.SignUpPassword ||
      currentStep === SignUpSteps.SignUpSeed
    ) {
      return { text: 'Back', onClick: () => goToPreviousStep() }
    }
  }, [currentStep, goToPreviousStep, setAuthModalOpenName, ytResponseData])

  const cancelButtonVisible = currentStep !== SignUpSteps.Success && currentStep !== SignUpSteps.Creating
  const isSuccess = currentStep === SignUpSteps.Success

  useEffect(() => {
    if (isSuccess) {
      trackMembershipCreation(signUpFormData.current.handle, signUpFormData.current.email)
    }
  }, [isSuccess, signUpFormData.current.email, signUpFormData.current.handle, trackMembershipCreation])

  useEffect(() => {
    authModalOpenName === 'signUp' &&
      trackPageView(stepToPageName[currentStep] ?? 'Sign up - unknown page', { isYppFlow })
  }, [authModalOpenName, currentStep, isYppFlow, trackPageView])

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
                signUpFormData.current = SIGNUP_FORM_DATA_INITIAL_STATE
                setAuthModalOpenName(undefined)
              },
            }
          : primaryButtonProps
      }
      secondaryButton={backButtonVisible}
      confetti={currentStep === SignUpSteps.Success && smMatch}
      additionalActionsNode={
        cancelButtonVisible ? (
          <Button
            variant="tertiary"
            onClick={() => {
              setAuthModalOpenName(undefined)
              signUpFormData.current = SIGNUP_FORM_DATA_INITIAL_STATE
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
          avatar={signUpFormData.current.avatar}
          handle={signUpFormData.current.handle}
        />
      )}
      {currentStep === SignUpSteps.SignUpSeed && (
        <SignUpSeedStep
          {...commonProps}
          onSeedSubmit={handleCreateMemberOnSeedStepSubmit}
          mnemonic={signUpFormData.current.mnemonic}
          confirmedCopy={signUpFormData.current.confirmedCopy}
        />
      )}
      {currentStep === SignUpSteps.SignUpPassword && (
        <SignUpPasswordStep
          {...commonProps}
          dialogContentRef={ref}
          onPasswordSubmit={handlePasswordStepSubmit}
          password={signUpFormData.current.password}
        />
      )}
      {currentStep === SignUpSteps.SignUpEmail && (
        <SignUpEmailStep
          {...commonProps}
          isOverflowing={overflow || !smMatch}
          isEmailAlreadyTakenError={emailAlreadyTakenError}
          onEmailSubmit={handleEmailStepSubmit}
          email={signUpFormData.current.email}
          confirmedTerms={signUpFormData.current.confirmedTerms}
        />
      )}
      {currentStep === SignUpSteps.Creating && <SignUpCreatingMemberStep {...commonProps} />}
      {currentStep === SignUpSteps.Success && (
        <SignUpSuccessStep avatarUrl={signUpFormData.current.avatar?.url || ''} amountOfTokens={amountOfTokens} />
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
