import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { NumberFormat } from '@/components/NumberFormat'
import { AmmModalFormTemplate } from '@/components/_crt/AmmModalTemplates'
import { AmmModalSummaryTemplate } from '@/components/_crt/AmmModalTemplates/AmmModalSummaryTemplate'
import { BuyMarketTokenSuccess } from '@/components/_crt/BuyMarketTokenModal/steps/BuyMarketTokenSuccess'
import { DialogProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee, useJoystream, useSubscribeAccountBalance } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { calcBuyMarketPricePerToken } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'

import { BuyMarketTokenConditions } from './steps/BuyMarketTokenConditions'

export type BuySaleTokenModalProps = {
  tokenId: string
  show: boolean
  onClose: () => void
}

enum BUY_MARKET_TOKEN_STEPS {
  form,
  conditions,
  summary,
  success,
}

export const BuyMarketTokenModal = ({ tokenId, onClose, show }: BuySaleTokenModalProps) => {
  const [activeStep, setActiveStep] = useState(BUY_MARKET_TOKEN_STEPS.form)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogProps['primaryButton']>()
  const amountRef = useRef<number | null>(null)
  const { control, watch, handleSubmit, reset, formState } = useForm<{ tokens: number }>()
  const tokens = watch('tokens') || 0
  const { fullFee } = useFee('purchaseTokenOnMarketTx', ['1', '1', String(tokens ?? 0), '1000000'])
  const { data, loading } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId,
    },
    onError: (error) => {
      SentryLogger.error('Error while fetching creator token', 'BuyMarketTokenModal', error)
    },
  })
  const client = useApolloClient()
  const { accountBalance } = useSubscribeAccountBalance()
  const title = data?.creatorTokenById?.symbol ?? 'N/A'

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
      case BUY_MARKET_TOKEN_STEPS.summary:
        return {
          text: 'Back',
          onClick: () => {
            setActiveStep(BUY_MARKET_TOKEN_STEPS.conditions)
          },
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

  const priceForAllToken = useMemo(() => {
    return hapiBnToTokenNumber(calculateRequiredHapi(Math.max(tokens, 1)) ?? new BN(0))
  }, [tokens, calculateRequiredHapi])
  const pricePerUnit = priceForAllToken / (tokens || 1)

  const commonProps = {
    setPrimaryButtonProps,
  }

  const onTermsSubmit = useCallback(() => setActiveStep(BUY_MARKET_TOKEN_STEPS.summary), [])

  const onTransactionSubmit = useCallback(() => {
    const slippageAmount = calculateRequiredHapi(amountRef.current ?? 0)
    if (!joystream || !memberId || !amountRef.current || !slippageAmount) {
      SentryLogger.error('Failed to submit buy market token', 'BuyMarketTokenModal', {
        joystream,
        memberId,
        amountRef,
        slippageAmount,
      })
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
        client.refetchQueries({ include: 'all' })
      },
      onError: () => {
        setActiveStep(BUY_MARKET_TOKEN_STEPS.form)
        SentryLogger.error('Error while buying market token', 'BuyMarketTokenModal', {
          joystream,
          memberId,
          amountRef,
          slippageAmount,
        })
        displaySnackbar({
          iconType: 'error',
          title: 'Something went wrong',
        })
      },
    })
  }, [calculateRequiredHapi, client, displaySnackbar, handleTransaction, joystream, memberId, proxyCallback, tokenId])

  const formDetails = useMemo(
    () => [
      {
        title: 'Available balance',
        content: <NumberFormat value={accountBalance ?? 0} as="p" variant="t200" withDenomination="before" withToken />,
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'You will pay',
        content: (
          <NumberFormat
            value={hapiBnToTokenNumber(calculateRequiredHapi(tokens) ?? new BN(0))}
            as="p"
            variant="h300"
            withDenomination="before"
            withToken
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
    ],
    [accountBalance, calculateRequiredHapi, tokens]
  )

  const summaryDetails = useMemo(
    () => [
      {
        title: 'Purchase',
        content: (
          <NumberFormat
            value={calculateRequiredHapi(tokens) ?? 0}
            as="p"
            variant="t200"
            withToken
            withDenomination="before"
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Price per unit',
        content: (
          <NumberFormat
            value={tokenNumberToHapiBn(pricePerUnit)}
            as="p"
            variant="t200"
            withToken
            withDenomination="before"
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Fee',
        content: <NumberFormat value={fullFee} as="p" variant="t200" withToken withDenomination="before" />,
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Total',
        content: (
          <NumberFormat
            value={fullFee.add(calculateRequiredHapi(tokens) ?? new BN(0))}
            as="p"
            variant="t200"
            withToken
            withDenomination="before"
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'You will get',
        content: (
          <NumberFormat
            value={tokens}
            as="p"
            variant="h300"
            withToken
            withDenomination="before"
            customTicker={`$${title}`}
            denominationMultiplier={pricePerUnit}
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
    ],
    [calculateRequiredHapi, fullFee, pricePerUnit, title, tokens]
  )

  useEffect(() => {
    if (!show) {
      reset({ tokens: 0 })
    }
  }, [reset, show])

  useEffect(() => {
    if (activeStep === BUY_MARKET_TOKEN_STEPS.form) {
      setPrimaryButtonProps({
        text: 'Continue',
        onClick: () =>
          handleSubmit((data) => {
            amountRef.current = data.tokens
            setActiveStep(BUY_MARKET_TOKEN_STEPS.conditions)
          })(),
      })
    }

    if (activeStep === BUY_MARKET_TOKEN_STEPS.summary) {
      setPrimaryButtonProps({
        text: `Buy $${data?.creatorTokenById?.symbol ?? 'N/A'}`,
        onClick: onTransactionSubmit,
      })
    }
  }, [activeStep, data?.creatorTokenById?.symbol, handleSubmit, onTransactionSubmit])

  if (!loading && !currentAmm && show) {
    SentryLogger.error('BuyAmmModal invoked on token without active amm', 'BuyMarketTokenModal', {
      loading,
      currentAmm,
    })
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
        <AmmModalFormTemplate
          control={control}
          details={formDetails}
          pricePerUnit={pricePerUnit}
          error={formState.errors.tokens?.message}
          validation={(value) => {
            if (!value || value < 1) return 'You need to buy at least one token'
            const requiredHapi = calculateRequiredHapi(value ?? 0)
            if (!accountBalance || !requiredHapi) return true
            return accountBalance.gte(requiredHapi) ? true : "You don't have enough balance to buy this many tokens"
          }}
        />
      )}
      {activeStep === BUY_MARKET_TOKEN_STEPS.conditions && (
        <BuyMarketTokenConditions {...commonProps} onSubmit={onTermsSubmit} />
      )}
      {activeStep === BUY_MARKET_TOKEN_STEPS.summary && <AmmModalSummaryTemplate details={summaryDetails} />}
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
