import axios, { AxiosError } from 'axios'
import { BN } from 'bn.js'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { FAUCET_URL } from '@/config/env'
import { JOY_CURRENCY_TICKER } from '@/config/joystream'
import { MemberId } from '@/joystream-lib'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransactionManagerStore } from '@/providers/transactions'
import { useUser, useUserStore } from '@/providers/user'
import { uploadAvatarImage } from '@/utils/image'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { StyledDialogModal } from './SignInModal.styles'
import { MemberFormData, SIGN_IN_MODAL_STEPS } from './SignInModal.types'
import {
  SignInModalAccountStep,
  SignInModalCreatingStep,
  SignInModalMembershipStep,
  SignInModalTermsStep,
  SignInModalWalletStep,
  SignInStepProps,
} from './SignInSteps'

export const SignInModal: FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number | null>(null)
  const currentStep = currentStepIdx != null ? SIGN_IN_MODAL_STEPS[currentStepIdx] : null
  const [cachedStepsIdx, setCachedStepIdx] = useState<number>(0) // keep cached step so that we can keep showing content when modal is in exit transition
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const { joystream } = useJoystream()
  const dialogContentRef = useRef<HTMLDivElement>(null)

  const { displaySnackbar } = useSnackbar()
  const { walletStatus, refetchUserMemberships, setActiveUser, isLoggedIn } = useUser()
  const { signInModalOpen, setSignInModalOpen } = useUserStore(
    (state) => ({ signInModalOpen: state.signInModalOpen, setSignInModalOpen: state.actions.setSignInModalOpen }),
    shallow
  )
  const addBlockAction = useTransactionManagerStore((state) => state.actions.addBlockAction)

  const walletConnected = walletStatus === 'connected'

  // handle opening/closing of modal and setting initial step
  useEffect(() => {
    if (!signInModalOpen) {
      setCurrentStepIdx(null)
      return
    }
    if (currentStep != null) return

    if (walletConnected) {
      setCurrentStepIdx(1)
      return
    }
    setCurrentStepIdx(0)
  }, [signInModalOpen, currentStep, walletConnected])

  // keep cachedStepIdx updated
  useEffect(() => {
    if (currentStepIdx != null) {
      setCachedStepIdx(currentStepIdx)
    }
  }, [currentStepIdx])

  const goToNextStep = useCallback(() => {
    setCurrentStepIdx((previousIdx) => (previousIdx ?? -1) + 1)
    setHasNavigatedBack(false)
  }, [])
  const goToPreviousStep = useCallback(() => {
    setCurrentStepIdx((previousIdx) => (previousIdx ?? 1) - 1)
    setHasNavigatedBack(true)
  }, [])

  const createNewMember = useCallback(async (address: string, data: MemberFormData) => {
    let fileUrl

    if (data.avatar?.blob) {
      fileUrl = await uploadAvatarImage(data.avatar.blob)
    }

    const body = {
      account: address,
      handle: data.handle,
      avatar: fileUrl,
      captchaToken: data.captchaToken,
    }
    const response = await axios.post<NewMemberResponse>(FAUCET_URL, body)
    return response.data
  }, [])

  const handleSubmit = useCallback(
    async (data: MemberFormData) => {
      if (!selectedAddress) return

      goToNextStep() // createMember will be called in member step, go to creating

      try {
        const callback = async () => {
          const { data } = await refetchUserMemberships()
          const lastCreatedMembership = data.memberships[data.memberships.length - 1]
          if (lastCreatedMembership) {
            setActiveUser({ accountId: selectedAddress, memberId: lastCreatedMembership.id, channelId: null })
            displaySnackbar({
              title: 'Your membership has been created',
              description: 'Browse, watch, create, collect videos across the platform and have fun!',
              iconType: 'success',
            })
            setSignInModalOpen(false)
          }
          if (!joystream) {
            ConsoleLogger.error('No joystream instance')
            return
          }
          const { lockedBalance } = await joystream.getAccountBalance(selectedAddress)
          const amountOfTokens = `${hapiBnToTokenNumber(new BN(lockedBalance))} ${JOY_CURRENCY_TICKER}`
          displaySnackbar({
            title: `You received ${amountOfTokens}`,
            description: `Enjoy your ${amountOfTokens} tokens to help you cover transaction fees. These tokens are non-transferable and can't be spent on NFTs or other purchases.`,
            iconType: 'info',
          })
        }
        const { block } = await createNewMember(selectedAddress, data)
        addBlockAction({ targetBlock: block, callback })
      } catch (error) {
        if (error.name === 'UploadAvatarServiceError') {
          displaySnackbar({
            title: 'Something went wrong',
            description: 'Avatar could not be uploaded. Try again later',
            iconType: 'error',
          })
          goToPreviousStep()
          return
        }
        SentryLogger.error('Failed to create a membership', 'SignInModal', error)
        const errorCode = error?.isAxiosError && (error as AxiosError<NewMemberResponse>).response?.data?.error
        displaySnackbar({
          title: 'Something went wrong',
          description: `There was a problem with creating your membership. Please try again later.${
            errorCode ? ` Error code: ${errorCode}` : ''
          }`,
          iconType: 'error',
        })
        goToPreviousStep() // go back to member form
      }
    },
    [
      addBlockAction,
      createNewMember,
      displaySnackbar,
      goToNextStep,
      goToPreviousStep,
      joystream,
      refetchUserMemberships,
      selectedAddress,
      setActiveUser,
      setSignInModalOpen,
    ]
  )

  const displayedStep = currentStep || SIGN_IN_MODAL_STEPS[cachedStepsIdx]

  // scroll the dialog content to top whenever the displayed step changes
  useEffect(() => {
    if (!dialogContentRef.current) return

    dialogContentRef.current.scrollTo({ top: 0 })
  }, [displayedStep])

  const renderStep = () => {
    const commonProps: SignInStepProps = {
      setPrimaryButtonProps,
      goToNextStep,
      hasNavigatedBack,
    }

    switch (displayedStep) {
      case 'wallet':
        return <SignInModalWalletStep {...commonProps} />
      case 'account':
        return (
          <SignInModalAccountStep
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            {...commonProps}
          />
        )
      case 'terms':
        return <SignInModalTermsStep {...commonProps} />
      case 'membership':
        return (
          <SignInModalMembershipStep onSubmit={handleSubmit} dialogContentRef={dialogContentRef} {...commonProps} />
        )
      case 'creating':
        return <SignInModalCreatingStep {...commonProps} />
    }
  }

  const backButtonVisible =
    currentStepIdx && currentStepIdx > 0 && currentStep !== 'creating' && (currentStep !== 'account' || !isLoggedIn)

  return (
    <StyledDialogModal
      show={!!currentStep}
      dividers={currentStep !== 'creating'}
      primaryButton={primaryButtonProps}
      secondaryButton={backButtonVisible ? { text: 'Back', onClick: goToPreviousStep } : undefined}
      onEscPress={() => setSignInModalOpen(false)}
      additionalActionsNode={
        currentStep !== 'creating' ? (
          <Button variant="tertiary" onClick={() => setSignInModalOpen(false)}>
            Cancel
          </Button>
        ) : null
      }
      additionalActionsNodeMobilePosition="bottom"
      contentRef={dialogContentRef}
    >
      {renderStep()}
    </StyledDialogModal>
  )
}

type NewMemberResponse = {
  memberId: MemberId
  block: number
  error?: string
}
