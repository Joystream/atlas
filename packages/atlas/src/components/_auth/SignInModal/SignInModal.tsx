import axios, { AxiosError } from 'axios'
import { FC, useCallback, useEffect, useState } from 'react'
import shallow from 'zustand/shallow'

import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { FAUCET_URL } from '@/config/urls'
import { MemberId } from '@/joystream-lib'
import { useSnackbar } from '@/providers/snackbars'
import { useTransactionManagerStore } from '@/providers/transactions'
import { useUser, useUserStore } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'

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

  const { displaySnackbar } = useSnackbar()
  const { walletStatus, refetchUserMemberships, setActiveUser } = useUser()
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

  const createMember = useCallback(
    async (data: MemberFormData) => {
      if (!selectedAddress) return

      goToNextStep() // createMember will be called in member step, go to creating

      try {
        const callback = () => {
          refetchUserMemberships().then(({ data }) => {
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
          })
        }
        const { block } = await createNewMember(selectedAddress, data)
        addBlockAction({ targetBlock: block, callback })
      } catch (error) {
        SentryLogger.error('Failed to create a membership', 'SignInModal', error)
        const errorCode = error?.isAxiosError && (error as AxiosError<NewMemberResponse>).response?.data?.error
        displaySnackbar({
          title: 'Something went wrong',
          description: `There was a problem with creating your membership. Please try again later.${
            errorCode && ` Error code: ${errorCode}`
          }`,
          iconType: 'error',
        })
        goToPreviousStep() // go back to member form
      }
    },
    [
      addBlockAction,
      displaySnackbar,
      goToNextStep,
      goToPreviousStep,
      refetchUserMemberships,
      selectedAddress,
      setActiveUser,
      setSignInModalOpen,
    ]
  )

  const renderStep = () => {
    const commonProps: SignInStepProps = {
      setPrimaryButtonProps,
      goToNextStep,
      hasNavigatedBack,
    }

    const displayedStep = currentStep || SIGN_IN_MODAL_STEPS[cachedStepsIdx]

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
        return <SignInModalMembershipStep createMember={createMember} {...commonProps} />
      case 'creating':
        return <SignInModalCreatingStep {...commonProps} />
    }
  }

  return (
    <StyledDialogModal
      show={!!currentStep}
      dividers={currentStep !== 'creating'}
      primaryButton={primaryButtonProps}
      secondaryButton={
        currentStepIdx && currentStepIdx > 0 && currentStep !== 'creating'
          ? { text: 'Back', onClick: goToPreviousStep }
          : undefined
      }
      additionalActionsNode={
        currentStep !== 'creating' ? (
          <Button variant="tertiary" onClick={() => setSignInModalOpen(false)}>
            Cancel
          </Button>
        ) : null
      }
      additionalActionsNodeMobilePosition="bottom"
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
const createNewMember = async (address: string, data: MemberFormData) => {
  const body = {
    account: address,
    ...data,
  }
  const response = await axios.post<NewMemberResponse>(FAUCET_URL, body)
  return response.data
}
