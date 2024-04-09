import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { NumberFormat, formatNumberShort } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { AmmModalFormTemplate } from '@/components/_crt/AmmModalTemplates'
import { AmmModalSummaryTemplate } from '@/components/_crt/AmmModalTemplates/AmmModalSummaryTemplate'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { calcSellMarketPricePerToken } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'
import { formatSmallDecimal, permillToPercentage } from '@/utils/number'

export type SellTokenModalProps = {
  tokenId: string
  onClose: () => void
  show: boolean
}

export const SellTokenModal = ({ tokenId, onClose: _onClose, show }: SellTokenModalProps) => {
  const [step, setStep] = useState<'form' | 'summary'>('form')
  const { control, watch, handleSubmit, formState, reset } = useForm<{ tokenAmount: number }>()
  const { memberId, memberChannels, channelId } = useUser()
  const tokenAmount = watch('tokenAmount') || 0
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { trackAMMTokensSold } = useSegmentAnalytics()
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
  const hasActiveRevenueShare = data?.creatorTokenById?.revenueShares.some((rS) => !rS.finalized)
  const client = useApolloClient()

  const currentAmm = data?.creatorTokenById?.currentAmmSale
  const ammBalance = currentAmm ? +currentAmm.mintedByAmm - +currentAmm.burnedByAmm : 0
  const title = data?.creatorTokenById?.symbol ?? 'N/A'
  const { tokenBalance: userTokenBalance } = useGetTokenBalance(tokenId)

  const onClose = useCallback(() => {
    reset({ tokenAmount: 0 })
    setStep('form')
    _onClose()
  }, [_onClose, reset])

  const calculateSlippageAmount = useCallback(
    (amount: number) => {
      const currentAmm = data?.creatorTokenById?.ammCurves.find((amm) => !amm.finalized)
      return calcSellMarketPricePerToken(
        currentAmm ? ammBalance : undefined,
        currentAmm?.ammSlopeParameter,
        currentAmm?.ammInitPrice,
        amount
      )
    },
    [ammBalance, data?.creatorTokenById?.ammCurves]
  )

  const priceForAllToken = useMemo(() => {
    return hapiBnToTokenNumber(calculateSlippageAmount(Math.max(tokenAmount, 1)) ?? new BN(0))
  }, [tokenAmount, calculateSlippageAmount])
  const pricePerUnit = priceForAllToken / (tokenAmount || 1)

  const formDetails = useMemo(() => {
    const percentageOfTotalSupply = data?.creatorTokenById
      ? (tokenAmount / +(data.creatorTokenById.totalSupply || 1)) * 100
      : 0
    const isOwner = memberChannels?.some((channel) => channel.id === data?.creatorTokenById?.channel?.channel.id)
    const userRevenueParticipation = data?.creatorTokenById?.revenueShareRatioPermill
      ? percentageOfTotalSupply *
        ((isOwner
          ? 100 - permillToPercentage(data.creatorTokenById.revenueShareRatioPermill)
          : permillToPercentage(data.creatorTokenById.revenueShareRatioPermill)) /
          100)
      : 0
    return [
      {
        title: 'Percentage of total supply',
        tooltipText: 'Percentage of total supply of the token that will be sold.',
        content: (
          <Text variant="h300" as="h3">
            {formatSmallDecimal(percentageOfTotalSupply)}%
          </Text>
        ),
      },
      {
        title: 'Percentage of revenue',
        tooltipText: 'Percentage of token creator revenue that will be sold through the tokens.',
        content: (
          <Text variant="h300" as="h3">
            {data?.creatorTokenById?.revenueShareRatioPermill ? formatSmallDecimal(userRevenueParticipation) : 0}%
          </Text>
        ),
      },
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
    ]
  }, [data?.creatorTokenById, memberChannels, priceForAllToken, pricePerUnit, title, tokenAmount, userTokenBalance])

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
        tooltipText:
          'Price of each incremental unit purchased or sold depends on overall quantity of tokens transacted, the actual average price per unit for the entire purchase or sale will differ from the price displayed for the first unit transacted.',
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

  const onFormSubmit = () => {
    if (hasActiveRevenueShare) {
      displaySnackbar({
        iconType: 'error',
        title: 'You cannot trade tokens during revenue share.',
      })
      return
    }

    handleSubmit(() => {
      setStep('summary')
    })()
  }

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
      onTxSync: async ({ receivedAmount }) => {
        const joyAmountReceived = hapiBnToTokenNumber(new BN(receivedAmount))
        trackAMMTokensSold(
          tokenId,
          data?.creatorTokenById?.symbol ?? 'N/A',
          channelId ?? 'N/A',
          tokenAmount,
          joyAmountReceived
        )
        displaySnackbar({
          iconType: 'success',
          title: `${formatNumberShort(joyAmountReceived)} ${atlasConfig.joystream.tokenTicker} received`,
          description: `You will find it in your portfolio.`,
        })
        client.refetchQueries({ include: 'all' })
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
          maxValue={Math.min(ammBalance, userTokenBalance)}
          details={formDetails}
          showTresholdButtons
          validation={(value) => {
            if (!value || value < 1) {
              return 'You need to sell at least one token.'
            }
            if (value > ammBalance) return `There is only ${ammBalance} $${title} available in the market.`
            if (value > userTokenBalance) return `Amount exceeds your account balance of ${userTokenBalance} $${title}.`
            return true
          }}
        />
      ) : (
        <AmmModalSummaryTemplate details={summaryDetails} />
      )}
    </DialogModal>
  )
}
