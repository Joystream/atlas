import { useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { BuySaleTokenForm } from '@/components/_crt/BuySaleTokenModal/steps/BuySaleTokenForm'
import { BuySaleTokenTerms } from '@/components/_crt/BuySaleTokenModal/steps/BuySaleTokenTerms'
import { DialogProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { transitions } from '@/styles'

type BuySaleTokenModalProps = {
  tokenId: string
  onClose: () => void
}

enum BUY_SALE_TOKEN_STEPS {
  form,
  terms,
}

export const BuySaleTokenModal = ({ tokenId, onClose }: BuySaleTokenModalProps) => {
  const [activeStep, setActiveStep] = useState(BUY_SALE_TOKEN_STEPS.form)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogProps['primaryButton']>()
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isGoingBack, setIsGoingBack] = useState(false)

  const secondaryButton = useMemo(
    () =>
      activeStep === BUY_SALE_TOKEN_STEPS.form
        ? {
            text: 'Cancel',
          }
        : {
            text: 'Back',
            onClick: () => {
              flushSync(() => {
                setIsGoingBack(true)
              })
              setActiveStep(BUY_SALE_TOKEN_STEPS.form)
            },
          },
    [activeStep]
  )

  const commonProps = {
    setPrimaryButtonProps,
  }

  return (
    <DialogModal
      title="Buy $JBC"
      dividers={activeStep === BUY_SALE_TOKEN_STEPS.terms}
      show
      onExitClick={onClose}
      primaryButton={primaryButtonProps}
      secondaryButton={secondaryButton}
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
            {activeStep === BUY_SALE_TOKEN_STEPS.form && (
              <BuySaleTokenForm
                {...commonProps}
                onSubmit={() => setActiveStep(BUY_SALE_TOKEN_STEPS.terms)}
                tokenId={tokenId}
              />
            )}
            {activeStep === BUY_SALE_TOKEN_STEPS.terms && (
              <BuySaleTokenTerms
                {...commonProps}
                onSubmit={() => setActiveStep(BUY_SALE_TOKEN_STEPS.terms)}
                tokenId={tokenId}
              />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </DialogModal>
  )
}
