import { FC, useCallback, useEffect, useRef, useState } from 'react'
import shallow from 'zustand/shallow'

import { GetMembershipsQuery } from '@/api/queries/__generated__/memberships.generated'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { Button } from '@/components/_buttons/Button'
import { DialogButtonProps } from '@/components/_overlays/Dialog'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useAuthStore } from '@/providers/auth/auth.store'
import { formatDurationBiggestTick } from '@/utils/time'

import { StyledDialogModal } from './ExternalSignInModal.styles'
import {
  ExternalSignInModalMembershipsStep,
  ExternalSignInModalWalletStep,
  ModalSteps,
  SignInStepProps,
} from './ExternalSignInSteps'

import { CheckEmailConfirmation } from '../genericSteps/CheckEmailConfirmation'
import { ProvideEmailForLink } from '../genericSteps/ProvideEmailForLink'

const stepToPageName: Partial<Record<ModalSteps, string>> = {
  [ModalSteps.Email]: 'External sign in modal - Add email to existing membership',
  [ModalSteps.Logging]: 'External sign in modal - logging',
  [ModalSteps.Wallet]: 'External sign in modal - wallet selection',
  [ModalSteps.Membership]: 'External sign in modal - membership params',
  [ModalSteps.NoMembership]: 'External sign in modal - no membership',
  [ModalSteps.Register]: 'External sign in modal - register',
}
export const ExternalSignInModal: FC = () => {
  const [currentStep, setCurrentStep] = useState<ModalSteps>(ModalSteps.Wallet)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogButtonProps>({ text: 'Select wallet' }) // start with sensible default so that there are no jumps after first effect runs
  const [hasNavigatedBack, setHasNavigatedBack] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null)
  const [availableMemberships, setAvailableMemberships] = useState<GetMembershipsQuery['memberships'] | null>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const { trackPageView } = useSegmentAnalytics()
  const formRef = useRef<{ email?: string }>({})
  const { authModalOpenName, setAuthModalOpenName } = useAuthStore(
    (state) => ({
      authModalOpenName: state.authModalOpenName,
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )

  const goToPreviousStep = useCallback((step: ModalSteps) => {
    setCurrentStep(step)
    setHasNavigatedBack(true)
  }, [])

  // scroll the dialog content to top whenever the displayed step changes
  useEffect(() => {
    if (!dialogContentRef.current) return

    dialogContentRef.current.scrollTo({ top: 0 })
  }, [currentStep])

  useEffect(() => {
    authModalOpenName === 'externalLogIn' &&
      trackPageView(stepToPageName[currentStep] ?? 'External login - unknown page')
  }, [authModalOpenName, currentStep, trackPageView])

  const renderStep = () => {
    const commonProps: SignInStepProps = {
      setPrimaryButtonProps,
      goToStep: setCurrentStep,
      hasNavigatedBack,
    }

    switch (currentStep) {
      case ModalSteps.Wallet:
        return (
          <ExternalSignInModalWalletStep
            {...commonProps}
            goToStep={(val) => setCurrentStep(val as ModalSteps)}
            setAvailableMemberships={setAvailableMemberships}
          />
        )
      case ModalSteps.Membership:
        return (
          <ExternalSignInModalMembershipsStep
            {...commonProps}
            memberships={availableMemberships}
            goToStep={(val) => setCurrentStep(val as ModalSteps)}
            memberId={selectedMembership}
            setMemberId={setSelectedMembership}
            handleNoAccount={() => setCurrentStep(ModalSteps.Email)}
          />
        )
      case ModalSteps.Email:
        return (
          <ProvideEmailForLink
            onSubmit={(email) => {
              formRef.current = { email }
              setCurrentStep(ModalSteps.ConfirmationLink)
            }}
            setActionButtonHandler={(fn) =>
              setPrimaryButtonProps({
                text: 'Continue',
                onClick: () => fn(),
              })
            }
          />
        )
      case ModalSteps.ConfirmationLink:
        return (
          <CheckEmailConfirmation
            email={formRef.current.email}
            setActionButtonHandler={(fn) =>
              setPrimaryButtonProps({
                text: 'Resend',
                onClick: () => fn(),
              })
            }
            onSuccess={() => {
              const resendTimestamp = new Date()

              const calcRemainingTime = (date: Date) => {
                const difference = Date.now() - date.getTime()
                if (difference > 30_000) {
                  clearInterval(id)
                  setPrimaryButtonProps((prev) => ({
                    ...prev,
                    text: `Resend`,
                    disabled: false,
                  }))
                  return
                }
                const duration = formatDurationBiggestTick(Math.floor(30 - difference / 1000))
                setPrimaryButtonProps((prev) => ({
                  ...prev,
                  text: `Resend (${duration.replace('seconds', 's')})`,
                  disabled: true,
                }))
              }

              calcRemainingTime(resendTimestamp)

              const id = setInterval(() => {
                calcRemainingTime(resendTimestamp)
              }, 1000)
            }}
          />
        )
      // return <ExternalSignInModalEmailStep {...commonProps} memberId={selectedMembership} />
      // case ModalSteps.Logging:
      //   return (
      //     <AuthenticationModalStepTemplate
      //       title="Logging in"
      //       subtitle="Please wait while we log you in. This should take about 10 seconds."
      //       loader
      //       hasNavigatedBack={false}
      //     />
      //   )
      case ModalSteps.ExtensionSigning:
        return (
          <AuthenticationModalStepTemplate
            title="Waiting for extension"
            subtitle="Please sign the payload with your extension."
            loader
            hasNavigatedBack={false}
          />
        )
      case ModalSteps.NoMembership: {
        return (
          <AuthenticationModalStepTemplate
            title="No memberships connected"
            subtitle="It looks like you don’t have a membership connected to this wallet. Use your email and password to sign in."
            hasNavigatedBack={false}
          />
        )
      }
    }
  }

  useEffect(() => {
    if (currentStep === ModalSteps.NoMembership) {
      setPrimaryButtonProps({
        text: 'Use email & password',
        onClick: () => setAuthModalOpenName('logIn'),
      })
    }
  }, [currentStep, setAuthModalOpenName])

  const modalButtons = [ModalSteps.Logging, ModalSteps.ExtensionSigning].includes(currentStep)
    ? {}
    : {
        primaryButton: primaryButtonProps,
        secondaryButton: [ModalSteps.Membership, ModalSteps.NoMembership].includes(currentStep)
          ? { text: 'Back', onClick: () => goToPreviousStep(ModalSteps.Wallet) }
          : [ModalSteps.Wallet, ModalSteps.NoMembership].includes(currentStep)
          ? { text: 'Use email & password', onClick: () => setAuthModalOpenName('logIn') }
          : undefined,
        additionalActionsNode: [
          ModalSteps.Wallet,
          ModalSteps.Membership,
          ModalSteps.Email,
          ModalSteps.ConfirmationLink,
        ].includes(currentStep) && (
          <Button
            variant="tertiary"
            onClick={() => {
              setAuthModalOpenName(undefined)
            }}
          >
            Cancel
          </Button>
        ),
      }

  return (
    <StyledDialogModal
      {...modalButtons}
      show={authModalOpenName === 'externalLogIn'}
      additionalActionsNodeMobilePosition="bottom"
      contentRef={dialogContentRef}
      dividers={currentStep === ModalSteps.Membership}
      disableBackdropAnimation
    >
      {renderStep()}
    </StyledDialogModal>
  )
}
