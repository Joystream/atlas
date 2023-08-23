import { useMemo, useState } from 'react'

import { BuySaleTokenForm } from '@/components/_crt/BuySaleTokenModal/steps/BuySaleTokenForm'
import { BuySaleTokenTerms } from '@/components/_crt/BuySaleTokenModal/steps/BuySaleTokenTerms'
import { DialogProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'

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

  const secondaryButton = useMemo(
    () =>
      activeStep === BUY_SALE_TOKEN_STEPS.form
        ? {
            text: 'Cancel',
          }
        : {
            text: 'Back',
            onClick: () => {
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
          tokenAmount={1000}
        />
      )}
    </DialogModal>
  )
}
