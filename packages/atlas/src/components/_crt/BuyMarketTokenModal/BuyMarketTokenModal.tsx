import BN from 'bn.js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import {
  useGetCreatorTokenHoldersQuery,
  useGetFullCreatorTokenQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { AmmModalFormTemplate } from '@/components/_crt/AmmModalTemplates'
import { AmmModalSummaryTemplate } from '@/components/_crt/AmmModalTemplates/AmmModalSummaryTemplate'
import { BuyMarketTokenSuccess } from '@/components/_crt/BuyMarketTokenModal/steps/BuyMarketTokenSuccess'
import { DialogProps } from '@/components/_overlays/Dialog'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { useDismissibleAction } from '@/hooks/useDismissibleAction'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { useFee, useJoystream, useSubscribeAccountBalance } from '@/providers/joystream'
import { useNetworkUtils } from '@/providers/networkUtils/networkUtils.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { calcBuyMarketPricePerToken } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'
import { formatSmallDecimal, permillToPercentage } from '@/utils/number'

import { BuyMarketTokenConditions, CONDITIONS_ACTION_ID } from './steps/BuyMarketTokenConditions'

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

export const BuyMarketTokenModal = ({ tokenId, onClose: _onClose, show }: BuySaleTokenModalProps) => {
  const { memberId, memberChannels } = useUser()
  const navigate = useNavigate()
  const [hasAcceptedConditions, handleUpdateAction] = useDismissibleAction(CONDITIONS_ACTION_ID)
  const { refetchAllMemberTokenHolderQueries, refetchCreatorTokenData, refetchAllMemberTokenBalanceData } =
    useNetworkUtils()
  const [activeStep, setActiveStep] = useState(BUY_MARKET_TOKEN_STEPS.form)
  const [primaryButtonProps, setPrimaryButtonProps] = useState<DialogProps['primaryButton']>()
  const amountRef = useRef<number | null>(null)
  const { control, watch, handleSubmit, reset, formState } = useForm<{ tokenAmount: number }>()
  const tokenAmount = watch('tokenAmount') || 0
  const { fullFee } = useFee('purchaseTokenOnMarketTx', ['1', '1', String(tokenAmount ?? 0), '1000000'])
  const { data, loading } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId,
    },
    onError: (error) => {
      SentryLogger.error('Error while fetching creator token', 'BuyMarketTokenModal', error)
    },
  })
  const hasActiveRevenueShare = data?.creatorTokenById?.revenueShares.some((rS) => !rS.finalized)
  const { data: memberTokenAccount } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        token: {
          id_eq: tokenId,
        },
        member: {
          id_eq: memberId,
        },
      },
    },
    skip: !memberId,
  })
  const { accountBalance } = useSubscribeAccountBalance()
  const tokenTitle = data?.creatorTokenById?.symbol ?? 'N/A'
  const currentAmm = data?.creatorTokenById?.ammCurves.find((amm) => !amm.finalized)
  const smMatch = useMediaMatch('sm')
  const { displaySnackbar } = useSnackbar()
  const { channelId } = useUser()
  const { trackAMMTokensPurchased } = useSegmentAnalytics()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()

  const onClose = useCallback(() => {
    reset({ tokenAmount: 0 })
    setActiveStep(BUY_MARKET_TOKEN_STEPS.form)
    _onClose()
  }, [_onClose, reset])

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
        +currentAmm.mintedByAmm - +currentAmm.burnedByAmm,
        currentAmm.ammSlopeParameter,
        currentAmm.ammInitPrice,
        amount
      )
    },
    [data?.creatorTokenById]
  )

  const priceForAllToken = useMemo(() => {
    return hapiBnToTokenNumber(calculateRequiredHapi(Math.max(tokenAmount, 1)) ?? new BN(0))
  }, [tokenAmount, calculateRequiredHapi])
  const pricePerUnit = priceForAllToken / (tokenAmount || 1)

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
        if (memberTokenAccount?.tokenAccounts.length) {
          trackAMMTokensPurchased(
            data?.creatorTokenById?.id ?? 'N/A',
            data?.creatorTokenById?.symbol ?? 'N/A',
            channelId ?? 'N/A',
            tokenAmount,
            priceForAllToken
          )
          handleUpdateAction(true)
          displaySnackbar({
            iconType: 'success',
            title: `${tokenAmount} $${tokenTitle} purchased`,
            description: 'You will find it in your portfolio.',
            actionText: 'Go to portfolio',
            onActionClick: () => navigate(absoluteRoutes.viewer.portfolio()),
          })
          onClose()
        } else {
          setActiveStep(BUY_MARKET_TOKEN_STEPS.success)
        }
        refetchCreatorTokenData(tokenId)
        refetchAllMemberTokenHolderQueries().then(() => {
          refetchAllMemberTokenBalanceData()
        })
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
  }, [
    calculateRequiredHapi,
    joystream,
    memberId,
    handleTransaction,
    tokenId,
    proxyCallback,
    memberTokenAccount?.tokenAccounts.length,
    refetchCreatorTokenData,
    refetchAllMemberTokenHolderQueries,
    trackAMMTokensPurchased,
    data?.creatorTokenById?.id,
    data?.creatorTokenById?.symbol,
    channelId,
    tokenAmount,
    priceForAllToken,
    handleUpdateAction,
    displaySnackbar,
    tokenTitle,
    onClose,
    navigate,
    refetchAllMemberTokenBalanceData,
  ])

  const formDetails = useMemo(() => {
    const requiredHapi = calculateRequiredHapi(tokenAmount)
    const percentageOfTotalSupply = data?.creatorTokenById
      ? (tokenAmount / (+(data.creatorTokenById.totalSupply || 1) + tokenAmount)) * 100
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
        tooltipText: 'Percentage of total supply of the token that will be bought.',
        content: (
          <Text variant="h300" as="h3">
            {formatSmallDecimal(percentageOfTotalSupply)}%
          </Text>
        ),
      },
      {
        title: 'Percentage of revenue',
        tooltipText: 'Percentage of token creator revenue that will be bought through the tokens.',
        content: (
          <Text variant="h300" as="h3">
            {data?.creatorTokenById?.revenueShareRatioPermill ? formatSmallDecimal(userRevenueParticipation) : 0}%
          </Text>
        ),
      },
      {
        title: 'Available balance',
        content: <NumberFormat value={accountBalance ?? 0} as="p" variant="t200" withDenomination="before" withToken />,
        tooltipText: 'Available balance for current membership.',
      },
      {
        title: 'You will pay',
        content: (
          <NumberFormat
            value={hapiBnToTokenNumber(requiredHapi ?? new BN(0))}
            as="p"
            variant="h300"
            withDenomination="before"
            format="short"
            withToken
          />
        ),
        tooltipText: 'Estimated price that will be payed for tokens.',
      },
    ]
  }, [accountBalance, calculateRequiredHapi, data?.creatorTokenById, memberChannels, tokenAmount])

  const summaryDetails = useMemo(() => {
    const requiredHapi = calculateRequiredHapi(tokenAmount)
    return [
      {
        title: 'Purchase',
        content: <NumberFormat value={requiredHapi ?? 0} as="p" variant="t200" withToken withDenomination="before" />,
        tooltipText: 'Price for all the tokens.',
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
        title: 'Total',
        content: (
          <NumberFormat
            value={fullFee.add(requiredHapi ?? new BN(0))}
            as="p"
            variant="t200"
            withToken
            withDenomination="before"
          />
        ),
        tooltipText: 'Total cost - fees plus price for tokens.',
      },
      {
        title: 'You will get',
        content: (
          <NumberFormat
            value={tokenAmount}
            as="p"
            variant="h300"
            withToken
            withDenomination="before"
            customTicker={`$${tokenTitle}`}
            denominationMultiplier={pricePerUnit}
          />
        ),
        tooltipText: 'Amount of tokens current membership will receive.',
      },
    ]
  }, [calculateRequiredHapi, fullFee, pricePerUnit, tokenTitle, tokenAmount])

  useEffect(() => {
    if (activeStep === BUY_MARKET_TOKEN_STEPS.form) {
      setPrimaryButtonProps({
        text: 'Continue',
        onClick: () => {
          if (hasActiveRevenueShare) {
            displaySnackbar({
              iconType: 'error',
              title: 'You cannot trade tokens during revenue share.',
            })
            return
          }
          handleSubmit((data) => {
            amountRef.current = data.tokenAmount
            setActiveStep(hasAcceptedConditions ? BUY_MARKET_TOKEN_STEPS.summary : BUY_MARKET_TOKEN_STEPS.conditions)
          })()
        },
      })
    }

    if (activeStep === BUY_MARKET_TOKEN_STEPS.summary) {
      setPrimaryButtonProps({
        text: `Buy $${data?.creatorTokenById?.symbol ?? 'N/A'}`,
        onClick: onTransactionSubmit,
      })
    }
  }, [
    activeStep,
    data?.creatorTokenById?.symbol,
    displaySnackbar,
    handleSubmit,
    hasAcceptedConditions,
    hasActiveRevenueShare,
    onTransactionSubmit,
  ])

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
          maxInputValue={10_000_000}
          error={formState.errors.tokenAmount?.message}
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
          tokenAmount={tokenAmount}
          tokenName={data?.creatorTokenById?.symbol ?? 'N/A'}
        />
      )}
    </DialogModal>
  )
}
