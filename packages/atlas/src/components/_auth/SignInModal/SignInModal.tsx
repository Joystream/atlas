import axios from 'axios'
import { BN } from 'bn.js'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { atlasConfig } from '@/config'
import { FAUCET_URL } from '@/config/env'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { MemberId } from '@/joystream-lib/types'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransactionManagerStore } from '@/providers/transactions/transactions.store'
import { useUser } from '@/providers/user/user.hooks'
import { useUserStore } from '@/providers/user/user.store'
import { isAxiosError } from '@/utils/error'
import { uploadAvatarImage } from '@/utils/image'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { formatNumber } from '@/utils/number'

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

type FaucetParams = {
  account: string
  handle: string
  avatar: string | undefined
  captchaToken: string | undefined
}

export const SignInModal: FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number | null>(null)
  const currentStep = currentStepIdx != null ? SIGN_IN_MODAL_STEPS[currentStepIdx] : null
  const [cachedStepsIdx, setCachedStepIdx] = useState<number>(0) // keep cached step so that we can keep showing content when modal is in exit transition
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const { joystream } = useJoystream()
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const [previouslyFailedData, setPreviouslyFailedData] = useState<MemberFormData | null>(null)
  const { mutateAsync: faucetMutation } = useMutation('faucet-post', (body: FaucetParams) =>
    axios.post<NewMemberResponse>(FAUCET_URL, body)
  )
  const { mutateAsync: avatarMutation } = useMutation('avatar-post', (croppedBlob: Blob) =>
    uploadAvatarImage(croppedBlob)
  )

  const { displaySnackbar } = useSnackbar()
  const { identifyUser } = useSegmentAnalytics()
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
  const goToPreviousStep = useCallback((data?: MemberFormData) => {
    if (data !== undefined) {
      setPreviouslyFailedData(data)
    }
    setCurrentStepIdx((previousIdx) => (previousIdx ?? 1) - 1)
    setHasNavigatedBack(true)
  }, [])

  const createNewMember = useCallback(
    async (address: string, data: MemberFormData) => {
      let fileUrl

      if (data.avatar?.blob) {
        fileUrl = await avatarMutation(data.avatar.blob)
      }

      const body: FaucetParams = {
        account: address,
        handle: data.handle,
        avatar: fileUrl,
        captchaToken: data.captchaToken,
      }
      const response = await faucetMutation(body)

      return response.data
    },
    [avatarMutation, faucetMutation]
  )

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
            identifyUser(lastCreatedMembership.id)
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
          const amountOfTokens = `${formatNumber(hapiBnToTokenNumber(new BN(lockedBalance)))} ${
            atlasConfig.joystream.tokenTicker
          }`
          displaySnackbar({
            title: `You received ${amountOfTokens}`,
            description: `Enjoy your ${amountOfTokens} tokens to help you cover transaction fees. These tokens are non-transferable and can't be spent on NFTs or other purchases.`,
            iconType: 'token',
          })
        }
        const { block } = await createNewMember(selectedAddress, data)
        addBlockAction({ targetBlock: block, callback })
        setPreviouslyFailedData(null)
      } catch (error) {
        if (error.name === 'UploadAvatarServiceError') {
          displaySnackbar({
            title: 'Something went wrong',
            description: 'Avatar could not be uploaded. Try again later',
            iconType: 'error',
          })
          goToPreviousStep(data)
          SentryLogger.error('Failed to upload member avatar', 'SignInModal', error)
          return
        }

        const errorCode = isAxiosError<NewMemberErrorResponse>(error) ? error.response?.data?.error : null

        SentryLogger.error('Failed to create a membership', 'SignInModal', error, { error: { errorCode } })

        switch (errorCode) {
          case 'TooManyRequestsPerIp':
            displaySnackbar({
              title: 'You reached a membership limit',
              description:
                'Your membership could not be created as you already created one recently from the same IP address. Try again in 2 days.',
              iconType: 'error',
            })
            break
          case 'TooManyRequests':
            displaySnackbar({
              title: 'Our system is overloaded',
              description:
                'Your membership could not be created as our system is undergoing a heavy traffic. Please, try again in a little while.',
              iconType: 'error',
            })
            break
          case 'OnlyNewAccountsCanBeUsedForScreenedMembers':
            displaySnackbar({
              title: 'This account is not new',
              description:
                'Your membership could not be created as the selected wallet account has either made some transactions in the past or has some funds already on it. Please, try again using a fresh wallet account. ',
              iconType: 'error',
            })
            break

          default:
            displaySnackbar({
              title: 'Something went wrong',
              description: `There was a problem with creating your membership. Please try again later.${
                errorCode ? ` Error code: ${errorCode}` : ''
              }`,
              iconType: 'error',
            })
            break
        }

        goToPreviousStep(data)
        return
      }
    },
    [
      addBlockAction,
      createNewMember,
      displaySnackbar,
      goToNextStep,
      goToPreviousStep,
      identifyUser,
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
          <SignInModalMembershipStep
            onSubmit={handleSubmit}
            previouslyFailedData={previouslyFailedData}
            dialogContentRef={dialogContentRef}
            {...commonProps}
          />
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
      secondaryButton={backButtonVisible ? { text: 'Back', onClick: () => goToPreviousStep() } : undefined}
      additionalActionsNode={
        currentStep !== 'creating' ? (
          <Button
            variant="tertiary"
            onClick={() => {
              setPreviouslyFailedData(null)
              setSignInModalOpen(false)
            }}
          >
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
}

type FaucetErrorType = 'TooManyRequestsPerIp' | 'TooManyRequests' | 'OnlyNewAccountsCanBeUsedForScreenedMembers'

type NewMemberErrorResponse = {
  error?: FaucetErrorType
}
