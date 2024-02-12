import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { NumberFormat, formatNumberShort } from '@/components/NumberFormat'
import { AmmModalFormTemplate } from '@/components/_crt/AmmModalTemplates'
import { AmmModalSummaryTemplate } from '@/components/_crt/AmmModalTemplates/AmmModalSummaryTemplate'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { calcSellMarketPricePerToken } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'

export type SellTokenModalProps = {
  tokenId: string
  onClose: () => void
  show: boolean
}

export const SellTokenModal = ({ tokenId, onClose: _onClose, show }: SellTokenModalProps) => {
  const [step, setStep] = useState<'form' | 'summary'>('form')
  const { control, watch, handleSubmit, formState, reset } = useForm<{ tokenAmount: number }>()
  const { memberId } = useUser()
  const tokenAmount = watch('tokenAmount') || 0
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const { fullFee } = useFee('sellTokenOnMarketTx', ['1', '1', '2', '10000000'])
  const { data, loading } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId,
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch token data', 'SellTokenModal', { error })
    },
  })

  const currentAmm = data?.creatorTokenById?.ammCurves.find((amm) => !amm.finalized)
  const title = data?.creatorTokenById?.symbol ?? 'N/A'
  const { tokenBalance: userTokenBalance } = useGetTokenBalance(tokenId)

  const onClose = useCallback(() => {
    reset({ tokenAmount: 0 })
    _onClose()
  }, [_onClose, reset])

  const calculateSlippageAmount = useCallback(
    (amount: number) => {
      const currentAmm = data?.creatorTokenById?.ammCurves.find((amm) => !amm.finalized)
      return calcSellMarketPricePerToken(
        currentAmm ? +currentAmm.mintedByAmm - +currentAmm.burnedByAmm : undefined,
        currentAmm?.ammSlopeParameter,
        currentAmm?.ammInitPrice,
        amount
      )
    },
    [data?.creatorTokenById]
  )

  const priceForAllToken = useMemo(() => {
    return hapiBnToTokenNumber(calculateSlippageAmount(Math.max(tokenAmount, 1)) ?? new BN(0))
  }, [tokenAmount, calculateSlippageAmount])
  const pricePerUnit = priceForAllToken / (tokenAmount || 1)

  const formDetails = useMemo(
    () => [
      {
        title: 'Available balance',
        content: (
          <NumberFormat
            value={userTokenBalance}
            as="p"
            variant="t200"
            withToken
            withDenomination="before"
            customTicker={`$${title}`}
            denominationMultiplier={pricePerUnit}
          />
        ),
        tooltipText: 'Available balance for current membership.',
      },
      {
        title: 'You will receive',
        content: (
          <NumberFormat
            value={tokenAmount > 0 ? priceForAllToken : 0}
            as="p"
            variant="t200-strong"
            withToken
            withDenomination="before"
          />
        ),
        tooltipText: `Amount of ${atlasConfig.joystream.tokenTicker} that you will receive for your tokens.`,
      },
    ],
    [priceForAllToken, pricePerUnit, title, tokenAmount, userTokenBalance]
  )

  const summaryDetails = useMemo(
    () => [
      {
        title: 'Selling',
        content: (
          <NumberFormat
            value={tokenAmount}
            as="p"
            variant="t200"
            withToken
            withDenomination="before"
            customTicker={`$${title}`}
            denominationMultiplier={pricePerUnit}
          />
        ),
        tooltipText: 'Amount of tokens that will be sold to the market.',
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
        tooltipText: 'Averaged price per token.',
      },
      {
        title: 'Fee',
        content: <NumberFormat value={fullFee} as="p" variant="t200" withToken withDenomination="before" />,
        tooltipText: 'Fees paid for including the transaction into the block.',
      },
      {
        title: 'You will get',
        content: (
          <NumberFormat
            value={calculateSlippageAmount(Math.max(tokenAmount, 1))?.sub(fullFee) ?? 0}
            as="p"
            variant="h300"
            withToken
            withDenomination="before"
          />
        ),
        tooltipText: `Amount of ${atlasConfig.joystream.tokenTicker} that you will receive for your tokens.`,
      },
    ],
    [calculateSlippageAmount, fullFee, pricePerUnit, title, tokenAmount]
  )

  const onFormSubmit = () =>
    handleSubmit(() => {
      setStep('summary')
    })()

  const onTransactionSubmit = async () => {
    const slippageTolerance = calculateSlippageAmount(tokenAmount)

    if (!joystream || !memberId || !slippageTolerance) {
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).sellTokenOnMarket(
          tokenId,
          memberId,
          String(tokenAmount),
          slippageTolerance.toString(),
          proxyCallback(updateStatus)
        ),
      onError: () => {
        displaySnackbar({
          title: 'Something went wrong',
          iconType: 'error',
        })
      },
      onTxSync: async () => {
        // todo add joys from rpc event
        displaySnackbar({
          iconType: 'success',
          title: `${formatNumberShort((tokenAmount * priceForAllToken) / tokenAmount)} ${
            atlasConfig.joystream.tokenTicker
          } received`,
          description: `You will find it in your portfolio.`,
        })
        onClose()
      },
    })
  }

  if (!loading && !currentAmm && show) {
    SentryLogger.error('SellAmmModal invoked on token without active amm', 'SellTokenModal', {
      loading,
      currentAmm,
    })
    throw new Error('SellAmmModal invoked on token without active amm')
  }

  const isFormStep = step === 'form'

  return (
    <DialogModal
      title={`Sell $${title}`}
      show={show}
      onExitClick={onClose}
      secondaryButton={{
        text: isFormStep ? 'Cancel' : 'Back',
        onClick: isFormStep ? onClose : () => setStep('form'),
      }}
      primaryButton={{
        text: isFormStep ? 'Continue' : `Sell $${title}`,
        onClick: isFormStep ? onFormSubmit : onTransactionSubmit,
      }}
    >
      {step === 'form' ? (
        <AmmModalFormTemplate
          control={control}
          error={formState.errors.tokenAmount?.message}
          pricePerUnit={pricePerUnit}
          maxValue={Math.min(+(currentAmm?.mintedByAmm ?? 0), userTokenBalance)}
          details={formDetails}
          validation={(value) => {
            if (!value || value < 1) {
              return 'You need to sell at least one token'
            }
            if (value > +(currentAmm?.mintedByAmm ?? 0)) return 'You cannot sell more tokens than minted'
            if (value > userTokenBalance) return 'Amount exceeds your account balance'
            return true
          }}
        />
      ) : (
        <AmmModalSummaryTemplate details={summaryDetails} />
      )}
    </DialogModal>
  )
}
