import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionPlay, SvgAlertsWarning24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { cVar } from '@/styles'
import { SentryLogger } from '@/utils/logs'

export type CloseMarketModalProps = {
  channelId: string
  tokenId: string
  show: boolean
  onClose: () => void
}

export const CloseMarketModal = ({ onClose, show, channelId, tokenId }: CloseMarketModalProps) => {
  // const { title, pricePerUnit, userCrtToken, tokenRequiredToSell } = getTokenDetails('1')
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
  const handleTransaction = useTransaction()
  const client = useApolloClient()
  const thresholdAmount = data?.creatorTokenById ? +data.creatorTokenById.totalSupply * 0.01 : 0
  const ammBalance = data?.creatorTokenById?.currentAmmSale
    ? +data.creatorTokenById.currentAmmSale.mintedByAmm - +data.creatorTokenById.currentAmmSale.burnedByAmm
    : 0
  const isBelowThreshold = thresholdAmount >= ammBalance
  const hasSufficientTokens = tokenBalance >= ammBalance - thresholdAmount

  const handleCloseAmm = useCallback(async () => {
    if (!joystream || !channelId || !memberId) {
      SentryLogger.error('Failed to submit close market', 'CloseMarketModal', { joystream, channelId, memberId })
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).closeAmm(memberId, channelId, proxyCallback(updateStatus)),
      onTxSync: async () => {
        await client.refetchQueries({ include: 'active' })
        displaySnackbar({
          iconType: 'success',
          title: 'Market closed',
        })
        onClose()
      },
      onError: () => {
        SentryLogger.error('Failed to close market', 'CloseMarketModal', { joystream, channelId, memberId })
        displaySnackbar({
          iconType: 'error',
          title: 'Something went wrong',
        })
      },
    })
  }, [joystream, channelId, memberId, handleTransaction, proxyCallback, client, displaySnackbar, onClose])

  return (
    <DialogModal
      show={show}
      title="Close market"
      onExitClick={onClose}
      primaryButton={{
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
          <TextButton icon={<SvgActionPlay />} iconPlacement="left">
            Learn more
          </TextButton>
        </FlexBox>

        {!hasSufficientTokens && (
          <Banner
            icon={<SvgAlertsWarning24 />}
            title={`Don't have enough $${symbol} tokens to close market`}
            description="Ask your community to sell tokens to market or wait for patronage to mint enough tokens for you."
            borderColor={cVar('colorTextCaution')}
          />
        )}

        <FlexBox flow="column" gap={2}>
          <FlexBox alignItems="center" justifyContent="space-between">
            <Text variant="t100" as="p" color={isBelowThreshold ? 'colorTextCaution' : 'colorText'}>
              You need to sell
            </Text>
            <NumberFormat
              value={ammBalance - thresholdAmount}
              as="p"
              variant="t100"
              withToken
              customTicker={`$${symbol}`}
              color={isBelowThreshold ? 'colorTextCaution' : 'colorText'}
            />
          </FlexBox>

          <FlexBox alignItems="center" justifyContent="space-between">
            <Text variant="t100" as="p" color="colorText">
              {isBelowThreshold ? 'You currently have' : 'You will receive'}
            </Text>
            <NumberFormat
              value={isBelowThreshold ? tokenBalance : tokenBalance}
              as="p"
              variant="t100"
              color="colorText"
              withToken
              customTicker={isBelowThreshold ? `$${symbol}` : ''}
            />
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}
