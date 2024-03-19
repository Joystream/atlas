import { ReactNode, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { CrtDrawer, CrtDrawerProps } from '@/components/CrtDrawer'
import { CreateTokenSuccessModal } from '@/components/_crt/CreateTokenSuccessModal'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { transitions } from '@/styles'

import { CreateTokenForm } from './CreateTokenDrawer.types'
import { SetupTokenStep, TokenIssuanceStep, TokenSummaryStep } from './steps'

enum CREATE_TOKEN_STEPS {
  setup,
  issuance,
  summary,
}

const steps: string[] = ['Set up token', 'Tokens issuance', 'Token summary']

const CREATOR_TOKEN_INITIAL_DATA: CreateTokenForm = {
  name: '',
  isOpen: true,
  revenueShare: 20,
  creatorReward: 10,
  creatorIssueAmount: 10_000,
  assuranceType: 'safe',
  cliff: null,
  vesting: null,
  firstPayout: 0,
}

type CreateTokenDrawerProps = {
  show: boolean
  onClose: () => void
}

export const CreateTokenDrawer = ({ show, onClose }: CreateTokenDrawerProps) => {
  const [activeStep, setActiveStep] = useState(CREATE_TOKEN_STEPS.setup)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const formData = useRef<CreateTokenForm>(CREATOR_TOKEN_INITIAL_DATA)
  const [primaryButtonProps, setPrimaryButtonProps] =
    useState<NonNullable<CrtDrawerProps['actionBar']>['primaryButton']>()
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isGoingBack, setIsGoingBack] = useState(false)
  const [preview, setPreview] = useState<ReactNode>()
  const formRef = useRef<HTMLDivElement>(null)
  const [openDialog, closeDialog] = useConfirmationModal({
    type: 'warning',
    title: 'Discard changes?',
    description:
      'You have unsaved changes which are going to be lost if you close this window. Are you sure you want to continue?',
    primaryButton: {
      variant: 'warning',
      text: 'Confirm and discard',
      onClick: () => {
        closeDialog()
        onClose()
      },
    },
    secondaryButton: {
      text: 'Cancel',
      onClick: () => closeDialog(),
    },
  })

  const scrollFormDown = () => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: formRef.current.scrollHeight, behavior: 'smooth' })
    }
  }

  const secondaryButton = useMemo(() => {
    switch (activeStep) {
      case CREATE_TOKEN_STEPS.setup:
        return {
          text: 'Cancel',
          onClick: () => (CREATOR_TOKEN_INITIAL_DATA === formData.current ? onClose() : openDialog()),
        }
      case CREATE_TOKEN_STEPS.issuance:
        return {
          text: 'Back',
          onClick: () => {
            flushSync(() => {
              setIsGoingBack(true)
            })
            setActiveStep(CREATE_TOKEN_STEPS.setup)
          },
        }
      case CREATE_TOKEN_STEPS.summary:
        return {
          text: 'Back',
          onClick: () => {
            flushSync(() => {
              setIsGoingBack(true)
            })
            setActiveStep(CREATE_TOKEN_STEPS.issuance)
          },
        }
    }
  }, [activeStep, onClose, openDialog])

  const commonProps = {
    setPrimaryButtonProps,
    setPreview,
    scrollFormDown,
    form: formData.current,
  }

  return (
    <>
      <CreateTokenSuccessModal show={showSuccessModal} tokenName={formData.current.name} />
      <CrtDrawer
        steps={steps}
        activeStep={activeStep}
        isOpen={show}
        onClose={() => onClose()}
        actionBar={{
          isNoneCrypto: true,
          primaryButton: primaryButtonProps ?? {},
          secondaryButton,
        }}
        preview={preview}
        formWrapperRef={formRef}
      >
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={activeStep}
            nodeRef={nodeRef}
            timeout={100}
            addEndListener={(done) => {
              nodeRef.current?.addEventListener('transitionend', done, false)
            }}
            onEntered={() => setIsGoingBack(false)}
            classNames={isGoingBack ? transitions.names.backwardSlideSwitch : transitions.names.forwardSlideSwitch}
          >
            <div ref={nodeRef}>
              {activeStep === CREATE_TOKEN_STEPS.setup && (
                <SetupTokenStep
                  {...commonProps}
                  onSubmit={(data) => {
                    formData.current = { ...formData.current, ...data }
                    setActiveStep(CREATE_TOKEN_STEPS.issuance)
                  }}
                />
              )}
              {activeStep === CREATE_TOKEN_STEPS.issuance && (
                <TokenIssuanceStep
                  {...commonProps}
                  onSubmit={(data) => {
                    formData.current = { ...formData.current, ...data }
                    setActiveStep(CREATE_TOKEN_STEPS.summary)
                  }}
                />
              )}
              {activeStep === CREATE_TOKEN_STEPS.summary && (
                <TokenSummaryStep {...commonProps} onSuccess={() => setShowSuccessModal(true)} />
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </CrtDrawer>
    </>
  )
}
