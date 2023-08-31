import styled from '@emotion/styled'

import { SvgActionChevronR } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, sizes } from '@/styles'

export type MarketWidgetProps = {
  pricePerUnit: number
  amountBoughtOnMarket: number
  amountSoldOnMarket: number
}

export const MarketWidget = ({ amountSoldOnMarket, amountBoughtOnMarket, pricePerUnit }: MarketWidgetProps) => {
  const smMatch = useMediaMatch('sm')
  return (
    <Container flow="column" gap={6}>
      <FlexBox justifyContent="space-between" alignItems="center">
        <Text variant="h500" as="h5">
          Market
        </Text>
        <TextButton icon={<SvgActionChevronR />} iconPlacement="right">
          Show sales
        </TextButton>
      </FlexBox>
      <FlexBox flow={smMatch ? 'row' : 'column'} gap={12} justifyContent="space-around">
        <FlexBox flow="column" gap={2}>
          <Text variant="h100" as="h1" color="colorText">
            PRICE PER UNIT
          </Text>
          <NumberFormat value={pricePerUnit} as="h4" variant="h400" withToken />
        </FlexBox>

        <FlexBox flow="column" gap={2}>
          <Text variant="h100" as="h1" color="colorText">
            BOUGHT ON MARKET
          </Text>
          <NumberFormat value={amountBoughtOnMarket} as="h4" variant="h400" withToken customTicker="$JBC" />
        </FlexBox>

        <FlexBox flow="column" gap={2}>
          <Text variant="h100" as="h1" color="colorText">
            SOLD TO MARKET
          </Text>
          <NumberFormat value={amountSoldOnMarket} as="h4" variant="h400" withToken customTicker="$JBC" />
        </FlexBox>
        <div>
          <StyledButton variant="destructive-secondary">Close market</StyledButton>
        </div>
      </FlexBox>
    </Container>
  )
}

const Container = styled(FlexBox)`
  padding: ${sizes(6)};
  background: ${cVar('colorBackgroundMuted')};
`

const StyledButton = styled(Button)`
  width: max-content;
`
