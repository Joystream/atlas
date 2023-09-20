import styled from '@emotion/styled'

import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { RatioPreview } from '@/components/RatioPreview/RatioPreview'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { media, sizes } from '@/styles'

export const CrtRevenueTab = () => {
  return (
    <WidgetContainer>
      <WidgetTile
        title="CURRENT STATE"
        customNode={
          <FlexBox flow="column">
            <Text variant="h500" as="h5">
              5/10 staked
            </Text>
            <Text variant="t100" as="p" color="colorText">
              50% of all holders
            </Text>
          </FlexBox>
        }
      />
      <WidgetTile
        title="CHANNEL BALANCE"
        customNode={
          <NumberFormat value={200} icon={<SvgJoyTokenMonochrome24 />} variant="h500" as="p" withDenomination />
        }
        tooltip={{
          text: 'Lorem ipsum',
        }}
      />
      <WidgetTile
        title="REVENUE SHARE RATIO"
        customNode={
          <RatioPreview
            ratios={[
              [20, 'Holders'],
              [80, 'Channel'],
            ]}
          />
        }
      />
    </WidgetContainer>
  )
}

const WidgetContainer = styled.div`
  display: flex;
  gap: ${sizes(4)};
  flex-wrap: wrap;

  > * {
    min-width: 320px;
    flex: 1;
  }

  ${media.md} {
    gap: ${sizes(6)};

    > * {
      min-width: 400px;
    }
  }
`
