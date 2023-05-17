import axios from 'axios'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import shallow from 'zustand/shallow'

import { SignInModalEmailStep } from '@/components/_auth/SignInModal/SignInSteps/SignInModalEmailStep'
import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { useUserStore } from '@/providers/user/user.store'
import { SentryLogger } from '@/utils/logs'

import { StyledDialogModal } from './SignInModal.styles'
import { SignInModalMembershipsStep, SignInModalWalletStep, SignInStepProps } from './SignInSteps'
import { SignInModalStepTemplate } from './SignInSteps/SignInModalStepTemplate'

const SIGN_IN_MODAL_STEPS = ['wallet', 'membership', 'logging', 'email'] as const

export const SignInModal: FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number | null>(null)
  const currentStep = currentStepIdx != null ? SIGN_IN_MODAL_STEPS[currentStepIdx] : null
  const [cachedStepsIdx, setCachedStepIdx] = useState<number>(0) // keep cached step so that we can keep showing content when modal is in exit transition
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const { joystream } = useJoystream()
  const { walletStatus } = useUser()
  const { signInModalOpen, setSignInModalOpen } = useUserStore(
    (state) => ({ signInModalOpen: state.signInModalOpen, setSignInModalOpen: state.actions.setSignInModalOpen }),
    shallow
  )

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

  const displayedStep = currentStep || SIGN_IN_MODAL_STEPS[cachedStepsIdx]

  // scroll the dialog content to top whenever the displayed step changes
  useEffect(() => {
    if (!dialogContentRef.current) return

    dialogContentRef.current.scrollTo({ top: 0 })
  }, [displayedStep])

  const onMemberSelect = useCallback(
    async (address: string) => {
      // switches to loading modal
      setCurrentStepIdx((prev) => (prev ?? -1) + 1)
      const payload = {
        joystreamAccountId: address,
        gatewayName: 'Gleev',
        timestamp: Date.now(),
        action: 'login',
      }

      const signature = await joystream?.signMessage({
        data: JSON.stringify(payload),
        type: 'payload',
      })

      try {
        const response = await axios.post<{ accountId: string }>(
          `https://atlas-dev.joystream.org/orion-auth/api/v1/login`,
          {
            signature: signature,
            payload,
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        // todo add cookie so user can perform actions
        setSignInModalOpen(false)
      } catch (error) {
        if (error.response.status !== 200) {
          // switches to email prompt
          setCurrentStepIdx((prev) => {
            return (prev ?? -1) + 1
          })
          return
        }
        SentryLogger.error('Error when posting login action', 'useLogIn', error)
      }
    },
    [joystream, setSignInModalOpen]
  )

  const renderStep = () => {
    const commonProps: SignInStepProps = {
      setPrimaryButtonProps,
      goToNextStep,
      hasNavigatedBack,
    }

    switch (displayedStep) {
      case 'wallet':
        return <SignInModalWalletStep {...commonProps} />
      case 'membership':
        return <SignInModalMembershipsStep {...commonProps} onConfirm={onMemberSelect} />
      case 'logging':
        return (
          <SignInModalStepTemplate
            title="Logginng in"
            subtitle="Please wait while we log you in. This should take about 10 seconds."
            loader
            hasNavigatedBack
          />
        )
      case 'email':
        return <SignInModalEmailStep {...commonProps} />
    }
  }

  const backButtonVisible = currentStepIdx && currentStepIdx > 0 //&& currentStep !== 'creating' && (currentStep !== 'account' || !isLoggedIn)

  return (
    <StyledDialogModal
      show={!!currentStep}
      dividers
      primaryButton={primaryButtonProps}
      secondaryButton={
        backButtonVisible
          ? { text: 'Back', onClick: () => goToPreviousStep() }
          : displayedStep === 'wallet'
          ? { text: 'Use email & password' }
          : undefined
      }
      additionalActionsNode={
        <Button
          variant="tertiary"
          onClick={() => {
            setSignInModalOpen(false)
          }}
        >
          Cancel
        </Button>
      }
      additionalActionsNodeMobilePosition="bottom"
      contentRef={dialogContentRef}
    >
      {renderStep()}
    </StyledDialogModal>
  )
}
