import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useCallback, useMemo } from 'react'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgAlertsWarning24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { cVar } from '@/styles'
import { calcSellMarketPricePerToken } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'

export type CloseMarketModalProps = {
  channelId: string
  tokenId: string
  show: boolean
  onClose: () => void
}

export const CloseMarketModal = ({ onClose, show, channelId, tokenId }: CloseMarketModalProps) => {
  const { memberId } = useUser()
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId ?? '',
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch creator token', 'CloseMarketModal', error)
    },
  })
  const { tokenBalance } = useGetTokenBalance(tokenId)
  const symbol = data?.creatorTokenById?.symbol
  const { joystream, proxyCallback } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const { trackAMMClosed } = useSegmentAnalytics()
  const handleTransaction = useTransaction()
  const client = useApolloClient()
  const thresholdAmount = data?.creatorTokenById ? Math.floor(+data.creatorTokenById.totalSupply * 0.01) : 0
  const ammBalance = data?.creatorTokenById?.currentAmmSale
    ? +data.creatorTokenById.currentAmmSale.mintedByAmm - +data.creatorTokenById.currentAmmSale.burnedByAmm
    : 0
  const hasSufficientTokens = tokenBalance >= ammBalance - thresholdAmount
  const amountToSell = Math.max(0, Math.floor(ammBalance - thresholdAmount))

  const calculateSlippageAmount = useCallback(
    (amount: number) => {
      const currentAmm = data?.creatorTokenById?.ammCurves.find(
        (amm) => amm.id === data.creatorTokenById?.currentAmmSale?.id
      )
      return calcSellMarketPricePerToken(
        currentAmm ? +currentAmm.mintedByAmm - +currentAmm.burnedByAmm : undefined,
        currentAmm?.ammSlopeParameter,
        currentAmm?.ammInitPrice,
        amount
      )
    },
    [data?.creatorTokenById]
  )

  const handleCloseAmm = useCallback(async () => {
    if (!joystream || !channelId || !memberId) {
      SentryLogger.error('Failed to submit close market', 'CloseMarketModal', { joystream, channelId, memberId })
      return
    }

    const closeMarketTransaction = () => {
      handleTransaction({
        allowMultiple: true,
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).closeAmm(memberId, channelId, proxyCallback(updateStatus)),
        onTxSync: async () => {
          trackAMMClosed(tokenId ?? 'N/A', symbol ?? 'N/A', channelId)
          displaySnackbar({
            iconType: 'success',
            title: 'Market closed',
          })
          onClose()
          client.refetchQueries({ include: 'active' }).catch(() => {
            displaySnackbar({
              title: 'Data update failed',
              description: 'Please refresh the page to get live data',
              iconType: 'error',
            })
          })
        },
        onError: () => {
          SentryLogger.error('Failed to close market', 'CloseMarketModal', { joystream, channelId, memberId })
          displaySnackbar({
            iconType: 'error',
            title: 'Something went wrong',
          })
        },
      })
    }

    if (amountToSell > 0) {
      const slippageTolerance = calculateSlippageAmount(amountToSell)
      if (!slippageTolerance) return
      handleTransaction({
        disableQNSync: true,
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).sellTokenOnMarket(
            tokenId,
            memberId,
            String(amountToSell),
            slippageTolerance.toString(),
            proxyCallback(updateStatus)
          ),
        onError: () => {
          displaySnackbar({
            title: 'Something went wrong',
            iconType: 'error',
          })
        },
        onTxFinalize: async () => {
          displaySnackbar({
            title: 'Successfully sold outstanding tokens',
            description: 'Sign second transaction to close the market',
            iconType: 'success',
          })
          closeMarketTransaction()
        },
      })
      return
    }

    closeMarketTransaction()
  }, [
    joystream,
    channelId,
    memberId,
    amountToSell,
    handleTransaction,
    proxyCallback,
    trackAMMClosed,
    symbol,
    displaySnackbar,
    onClose,
    client,
    calculateSlippageAmount,
    tokenId,
  ])

  const priceForAllToken = useMemo(() => {
    return hapiBnToTokenNumber(calculateSlippageAmount(Math.max(amountToSell, 1)) ?? new BN(0))
  }, [amountToSell, calculateSlippageAmount])

  return (
    <DialogModal
      show={show}
      title="Close market"
      onExitClick={onClose}
      primaryButton={{
        disabled: !hasSufficientTokens,
        text: 'Close market',
        variant: 'warning',
        onClick: () => handleCloseAmm(),
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: onClose,
      }}
    >
      <FlexBox flow="column" gap={6}>
        <FlexBox flow="column" gap={2}>
          <Text variant="t200" as="p" color="colorText">
            To close market you or any other member need to sell enough of ${symbol} tokens to the market to balance the
            amount of tokens minted with this market.
          </Text>
          {/*<TextButton icon={<SvgActionPlay />} iconPlacement="left">*/}
          {/*  Learn more*/}
          {/*</TextButton>*/}
        </FlexBox>

        {!hasSufficientTokens && (
          <Banner
            icon={<SvgAlertsWarning24 />}
            title={`Don't have enough $${symbol} tokens to close market`}
            description="Ask your community to sell tokens to market or wait for patronage to mint enough tokens for you."
            borderColor={cVar('colorTextCaution')}
          />
        )}

        {amountToSell ? (
          <Banner
            icon={<SvgAlertsWarning24 />}
            description="You will have to sign two transactions, the first one to sell your tokens, the second to close the market"
            borderColor={cVar('colorTextCaution')}
          />
        ) : null}

        <FlexBox flow="column" gap={2}>
          {amountToSell ? (
            <FlexBox alignItems="center" justifyContent="space-between">
              <Text variant="t100" as="p" color="colorTextCaution">
                You need to sell
              </Text>
              <NumberFormat
                value={amountToSell}
                as="p"
                variant="t100"
                withToken
                customTicker={`$${symbol}`}
                color="colorTextCaution"
              />
            </FlexBox>
          ) : null}

          <FlexBox alignItems="center" justifyContent="space-between">
            <Text variant="t100" as="p" color="colorText">
              {!hasSufficientTokens ? 'You currently have' : 'You will receive'}
            </Text>
            <NumberFormat
              value={!hasSufficientTokens ? tokenBalance : priceForAllToken}
              as="p"
              variant="t100"
              color="colorText"
              withToken
              customTicker={!hasSufficientTokens ? `$${symbol}` : ''}
            />
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}
