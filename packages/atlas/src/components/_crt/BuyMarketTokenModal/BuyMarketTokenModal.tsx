import { useCallback, useMemo, useState } from 'react'

import { BuyMarketTokenSuccess } from '@/components/_crt/BuyMarketTokenModal/steps/BuyMarketTokenSuccess'
import { DialogProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { BuyMarketTokenConditions } from './steps/BuyMarketTokenConditions'
import { BuySaleTokenForm } from './steps/BuyMarketTokenForm'

export type BuySaleTokenModalProps = {
  tokenId: string
  onClose: () => void
}

enum BUY_SALE_TOKEN_STEPS {
  form,
  conditions,
  success,
}

export const BuyMarketTokenModal = ({ tokenId, onClose }: BuySaleTokenModalProps) => {
  const [activeStep, setActiveStep] = useState(BUY_SALE_TOKEN_STEPS.form)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogProps['primaryButton']>()
  const smMatch = useMediaMatch('sm')

  const secondaryButton = useMemo(() => {
    switch (activeStep) {
      case BUY_SALE_TOKEN_STEPS.conditions:
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

  const onSubmitConditions = useCallback(() => setActiveStep(BUY_SALE_TOKEN_STEPS.success), [])

  return (
    <DialogModal
      title={activeStep !== BUY_SALE_TOKEN_STEPS.success ? 'Buy $JBC' : undefined}
      dividers={activeStep === BUY_SALE_TOKEN_STEPS.conditions}
      onExitClick={activeStep !== BUY_SALE_TOKEN_STEPS.success ? onClose : undefined}
      show
      primaryButton={primaryButtonProps}
      secondaryButton={secondaryButton}
      confetti={activeStep === BUY_SALE_TOKEN_STEPS.success && smMatch}
    >
      {activeStep === BUY_SALE_TOKEN_STEPS.form && (
        <BuySaleTokenForm
          {...commonProps}
          onSubmit={() => setActiveStep(BUY_SALE_TOKEN_STEPS.conditions)}
          tokenId={tokenId}
        />
      )}
      {activeStep === BUY_SALE_TOKEN_STEPS.conditions && (
        <BuyMarketTokenConditions {...commonProps} onSubmit={onSubmitConditions} />
      )}
      {activeStep === BUY_SALE_TOKEN_STEPS.success && (
        <BuyMarketTokenSuccess {...commonProps} onClose={onClose} tokenName="JBC" />
      )}
    </DialogModal>
  )
}
