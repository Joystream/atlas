import { useMemo, useState } from 'react'

import { BuySaleTokenForm } from '@/components/_crt/BuySaleTokenModal/steps/BuySaleTokenForm'
import { BuySaleTokenSuccess } from '@/components/_crt/BuySaleTokenModal/steps/BuySaleTokenSuccess'
import { BuySaleTokenTerms } from '@/components/_crt/BuySaleTokenModal/steps/BuySaleTokenTerms'
import { DialogProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'

export type BuySaleTokenModalProps = {
  tokenId: string
  onClose: () => void
}

enum BUY_SALE_TOKEN_STEPS {
  form,
  terms,
  success,
}

export const BuySaleTokenModal = ({ tokenId, onClose }: BuySaleTokenModalProps) => {
  const [activeStep, setActiveStep] = useState(BUY_SALE_TOKEN_STEPS.form)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogProps['primaryButton']>()
  const smMatch = useMediaMatch('sm')

  const secondaryButton = useMemo(() => {
    switch (activeStep) {
      case BUY_SALE_TOKEN_STEPS.terms:
        return {
          text: 'Back',
          onClick: () => {
            setActiveStep(BUY_SALE_TOKEN_STEPS.form)
          },
        }
      case BUY_SALE_TOKEN_STEPS.form:
        return {
          text: 'Cancel',
        }
      default:
        return undefined
    }
  }, [activeStep])

  const commonProps = {
    setPrimaryButtonProps,
  }

  return (
    <DialogModal
      title={activeStep !== BUY_SALE_TOKEN_STEPS.success ? 'Buy $JBC' : undefined}
      onExitClick={activeStep !== BUY_SALE_TOKEN_STEPS.success ? onClose : undefined}
      dividers={activeStep === BUY_SALE_TOKEN_STEPS.terms}
      show
      primaryButton={primaryButtonProps}
      secondaryButton={secondaryButton}
      noContentPadding={activeStep === BUY_SALE_TOKEN_STEPS.terms}
      confetti={activeStep === BUY_SALE_TOKEN_STEPS.success && smMatch}
    >
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
          onSubmit={() => setActiveStep(BUY_SALE_TOKEN_STEPS.success)}
          tokenId={tokenId}
          tokenAmount={1000}
        />
      )}
      {activeStep === BUY_SALE_TOKEN_STEPS.success && (
        <BuySaleTokenSuccess {...commonProps} onClose={onClose} tokenName="JBC" />
      )}
    </DialogModal>
  )
}
