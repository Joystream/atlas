import BN from 'bn.js'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { BuyMarketTokenSuccess } from '@/components/_crt/BuyMarketTokenModal/steps/BuyMarketTokenSuccess'
import { DialogProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { calcBuyMarketPricePerToken } from '@/utils/crts'

import { BuyMarketTokenConditions } from './steps/BuyMarketTokenConditions'
import { BuyMarketTokenForm } from './steps/BuyMarketTokenForm'

export type BuySaleTokenModalProps = {
  tokenId: string
  show: boolean
  onClose: () => void
}

enum BUY_MARKET_TOKEN_STEPS {
  form,
  conditions,
  success,
}

export const BuyMarketTokenModal = ({ tokenId, onClose, show }: BuySaleTokenModalProps) => {
  const [activeStep, setActiveStep] = useState(BUY_MARKET_TOKEN_STEPS.form)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogProps['primaryButton']>()
  const amountRef = useRef<number | null>(null)
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId,
    },
  })
  const currentAmm = data?.creatorTokenById?.ammCurves.find((amm) => !amm.finalized)

  const { memberId } = useUser()
  const smMatch = useMediaMatch('sm')
  const { displaySnackbar } = useSnackbar()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const secondaryButton = useMemo(() => {
    switch (activeStep) {
      case BUY_MARKET_TOKEN_STEPS.conditions:
        return {
          text: 'Back',
          onClick: () => {
            setActiveStep(BUY_MARKET_TOKEN_STEPS.form)
          },
        }
      case BUY_MARKET_TOKEN_STEPS.form:
        return {
          text: 'Cancel',
          onClick: onClose,
        }
      default:
        return undefined
    }
  }, [activeStep, onClose])

  const calculateRequiredHapi = useCallback(
    (amount: number) => {
      const currentAmm = data?.creatorTokenById?.ammCurves.find((amm) => !amm.finalized)
      if (!currentAmm) return
      if (amount === 0) {
        return new BN(0)
      }

      return calcBuyMarketPricePerToken(
        currentAmm.mintedByAmm,
        currentAmm.ammSlopeParameter,
        currentAmm.ammInitPrice,
        amount
      )
    },
    [data?.creatorTokenById]
  )

  const commonProps = {
    setPrimaryButtonProps,
  }

  const onSubmitConditions = useCallback(async () => {
    const slippageAmount = calculateRequiredHapi(amountRef.current ?? 0)
    if (!joystream || !memberId || !amountRef.current || !slippageAmount) {
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).purchaseTokenOnMarket(
          tokenId,
          memberId,
          String(amountRef.current),
          slippageAmount.toString(),
          proxyCallback(updateStatus)
        ),
      onTxSync: async () => {
        setActiveStep(BUY_MARKET_TOKEN_STEPS.success)
      },
      onError: () => {
        setActiveStep(BUY_MARKET_TOKEN_STEPS.form)
        displaySnackbar({
          title: 'Something went wrong',
        })
      },
    })
  }, [calculateRequiredHapi, displaySnackbar, handleTransaction, joystream, memberId, proxyCallback, tokenId])

  if (!currentAmm && show) {
    throw new Error('BuyAmmModal invoked on token without active amm')
  }

  return (
    <DialogModal
      title={
        activeStep !== BUY_MARKET_TOKEN_STEPS.success ? `Buy $${data?.creatorTokenById?.symbol ?? 'N/A'}` : undefined
      }
      dividers={activeStep === BUY_MARKET_TOKEN_STEPS.conditions}
      onExitClick={activeStep !== BUY_MARKET_TOKEN_STEPS.success ? onClose : undefined}
      show={show}
      primaryButton={primaryButtonProps}
      secondaryButton={secondaryButton}
      confetti={activeStep === BUY_MARKET_TOKEN_STEPS.success && smMatch}
      noContentPadding={activeStep === BUY_MARKET_TOKEN_STEPS.conditions}
    >
      {activeStep === BUY_MARKET_TOKEN_STEPS.form && (
        <BuyMarketTokenForm
          {...commonProps}
          calculateRequiredHapi={calculateRequiredHapi}
          pricePerUnit={hapiBnToTokenNumber(calculateRequiredHapi(1) ?? new BN(0))}
          onSubmit={(tokens) => {
            setActiveStep(BUY_MARKET_TOKEN_STEPS.conditions)
            amountRef.current = tokens
          }}
          token={data?.creatorTokenById}
        />
      )}
      {activeStep === BUY_MARKET_TOKEN_STEPS.conditions && (
        <BuyMarketTokenConditions {...commonProps} onSubmit={onSubmitConditions} />
      )}
      {activeStep === BUY_MARKET_TOKEN_STEPS.success && (
        <BuyMarketTokenSuccess
          {...commonProps}
          onClose={() => {
            onClose()
            setActiveStep(BUY_MARKET_TOKEN_STEPS.form)
          }}
          tokenName={data?.creatorTokenById?.symbol ?? 'N/A'}
        />
      )}
    </DialogModal>
  )
}
