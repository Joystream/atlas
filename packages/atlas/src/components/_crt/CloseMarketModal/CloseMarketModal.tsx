import { SvgActionPlay, SvgAlertsWarning24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { cVar } from '@/styles'

const getTokenDetails = (id: string) => ({
  title: 'JBC',
  pricePerUnit: 1000,
  userCrtToken: +id,
  tokenRequiredToSell: 35,
})

export type CloseMarketModalProps = {
  tokenId: string
}

export const CloseMarketModal = ({ tokenId }: CloseMarketModalProps) => {
  const { title, pricePerUnit, userCrtToken, tokenRequiredToSell } = getTokenDetails(tokenId)

  const hasInsufficientTokens = userCrtToken < tokenRequiredToSell

  return (
    <DialogModal
      show
      title="Close market"
      onExitClick={() => undefined}
      primaryButton={{
        text: 'Close market',
        variant: 'warning',
        onClick: () => null,
      }}
      secondaryButton={{
        text: 'Cancel',
      }}
    >
      <FlexBox flow="column" gap={6}>
        <FlexBox flow="column" gap={2}>
          <Text variant="t200" as="p" color="colorText">
            To close market you or any other member need to sell enough of $JBC tokens to the market to balance the
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
