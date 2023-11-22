import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { SvgActionPlay, SvgAlertsWarning24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { cVar } from '@/styles'

const getTokenDetails = (id: string) => ({
  title: 'JBC',
  pricePerUnit: 1000,
  userCrtToken: +id,
  tokenRequiredToSell: 35,
})

export type CloseMarketModalProps = {
  channelId: string
  show: boolean
  onClose: () => void
}

export const CloseMarketModal = ({ onClose, show, channelId }: CloseMarketModalProps) => {
  const { title, pricePerUnit, userCrtToken, tokenRequiredToSell } = getTokenDetails('1')
  const { joystream, proxyCallback } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const { memberId } = useUser()
  const handleTransaction = useTransaction()
  const client = useApolloClient()

  const hasInsufficientTokens = userCrtToken < tokenRequiredToSell

  const handleCloseAmm = useCallback(async () => {
    if (!joystream || !channelId || !memberId) {
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).closeAmm(memberId, channelId, proxyCallback(updateStatus)),
      onTxSync: async () => {
        client.refetchQueries({ include: 'active' }).then(() => {
          displaySnackbar({
            title: 'Market closed successfuly',
          })
          onClose()
        })
      },
      onError: () => {
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
            To close market you or any other member need to sell enough of ${title} tokens to the market to balance the
            amount of tokens minted with this market.
          </Text>
          <TextButton icon={<SvgActionPlay />} iconPlacement="left">
            Learn more
          </TextButton>
        </FlexBox>

        {hasInsufficientTokens && (
          <Banner
            icon={<SvgAlertsWarning24 />}
            title={`Don't have enough $${title} tokens to close market`}
            description="Ask your community to sell tokens to market or wait for patronage to mint enough tokens for you."
            borderColor={cVar('colorTextCaution')}
          />
        )}

        <FlexBox flow="column" gap={2}>
          <FlexBox alignItems="center" justifyContent="space-between">
            <Text variant="t100" as="p" color={hasInsufficientTokens ? 'colorTextCaution' : 'colorText'}>
              You need to sell
            </Text>
            <NumberFormat
              value={tokenRequiredToSell}
              as="p"
              variant="t100"
              withToken
              customTicker={`$${title}`}
              color={hasInsufficientTokens ? 'colorTextCaution' : 'colorText'}
            />
          </FlexBox>

          <FlexBox alignItems="center" justifyContent="space-between">
            <Text variant="t100" as="p" color="colorText">
              {hasInsufficientTokens ? 'You currently have' : 'You will receive'}
            </Text>
            <NumberFormat
              value={hasInsufficientTokens ? userCrtToken : pricePerUnit * userCrtToken}
              as="p"
              variant="t100"
              color="colorText"
              withToken
              customTicker={hasInsufficientTokens ? `$${title}` : ''}
            />
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}
