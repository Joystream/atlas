import { useMemo, useState } from 'react'

import { FlexBox } from '@/components/FlexBox/FlexBox'
import { Information } from '@/components/Information'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DetailsContent } from '@/components/_nft/NftTile'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'

export type SellTokenModalProps = {
  tokenId: string
  onClose: () => void
}

const getTokenDetails = (_: string) => ({
  title: 'JBC',
  pricePerUnit: 1000,
  tokensOnSale: 67773,
  userBalance: 100000,
})

export const SellTokenModal = ({ tokenId, onClose }: SellTokenModalProps) => {
  const [tokens, setTokens] = useState<number | null>(null)
  const smMatch = useMediaMatch('sm')
  const { pricePerUnit, tokensOnSale, userBalance, title } = getTokenDetails(tokenId)

  const details = useMemo(
    () => [
      {
        title: 'You will get',
        content: (
          <NumberFormat
            value={tokens || 0}
            format={(tokens || 0) > 1_000_000 ? 'short' : 'full'}
            as="p"
            variant="t200"
            withDenomination="before"
            withToken
            customTicker={`$${title}`}
          />
        ),
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'Fee',
        content: <NumberFormat value={tokensOnSale} as="p" variant="t200" withDenomination="before" withToken />,
        tooltipText: 'Lorem ipsum',
      },
      {
        title: 'You will spend',
        content: <NumberFormat value={tokensOnSale} as="p" variant="t200" withDenomination="before" withToken />,
        tooltipText: 'Lorem ipsum',
      },
    ],
    [title, tokens, tokensOnSale]
  )
  return (
    <DialogModal
      title={`Sell $${title}`}
      show
      onExitClick={onClose}
      primaryButton={{
        text: 'Sell tokens',
      }}
    >
      <FlexBox flow="column" gap={8}>
        <FlexBox gap={6} equalChildren>
          <DetailsContent
            avoidIconStyling
            tileSize={smMatch ? 'big' : 'bigSmall'}
            caption="PRICE PER UNIT"
            content={pricePerUnit}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            withDenomination
          />
          <DetailsContent
            avoidIconStyling
            tileSize={smMatch ? 'big' : 'bigSmall'}
            caption={`YOUR $${title} BALANCE`}
            content={userBalance}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            withDenomination
          />
        </FlexBox>
        <FormField label="Tokens to spend">
          <TokenInput
            value={tokens}
            onChange={setTokens}
            placeholder="0"
            nodeEnd={
              <FlexBox gap={2} alignItems="baseline">
                <Text variant="t300" as="p" color="colorTextMuted">
                  $0.00
                </Text>
                <TextButton>Max</TextButton>
              </FlexBox>
            }
          />
        </FormField>

        <FlexBox flow="column" gap={2}>
          {details.map((row, i) => (
            <FlexBox key={row.title} alignItems="center" justifyContent="space-between">
              <FlexBox width="fit-content" alignItems="center">
                <Text variant={i + 1 === details.length ? 't200-strong' : 't200'} as="p" color="colorText">
                  {row.title}
                </Text>
                <Information text={row.tooltipText} />
              </FlexBox>
              {row.content}
            </FlexBox>
          ))}
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}
