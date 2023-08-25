import { useMemo, useState } from 'react'

import { DialogProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'

import { BuyMarketTokenConditions } from './steps/BuyMarketTokenConditions'
import { BuySaleTokenForm } from './steps/BuyMarketTokenForm'

type BuySaleTokenModalProps = {
  tokenId: string
  onClose: () => void
}

enum BUY_SALE_TOKEN_STEPS {
  form,
  conditions,
}

export const BuyMarketTokenModal = ({ tokenId, onClose }: BuySaleTokenModalProps) => {
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
      dividers={activeStep === BUY_SALE_TOKEN_STEPS.conditions}
      show
      onExitClick={onClose}
      primaryButton={primaryButtonProps}
      secondaryButton={secondaryButton}
    >
      {activeStep === BUY_SALE_TOKEN_STEPS.form && (
        <BuySaleTokenForm
          {...commonProps}
          onSubmit={() => setActiveStep(BUY_SALE_TOKEN_STEPS.conditions)}
          tokenId={tokenId}
        />
      )}
      {activeStep === BUY_SALE_TOKEN_STEPS.conditions && (
        <BuyMarketTokenConditions {...commonProps} onSubmit={() => setActiveStep(BUY_SALE_TOKEN_STEPS.conditions)} />
      )}
    </DialogModal>
  )
}
