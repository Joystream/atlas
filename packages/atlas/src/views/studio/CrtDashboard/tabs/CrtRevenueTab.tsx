import styled from '@emotion/styled'

import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { RatioPreview } from '@/components/RatioPreview/RatioPreview'
import { WidgetTile } from '@/components/WidgetTile'
import { RevenueShareStateWidget } from '@/components/_crt/RevenueShareStateWidget'
import { media, sizes } from '@/styles'

const DATA = {
  revenueShare: {
    endDate: new Date(Date.now() + 1000000),
  },
}
export const CrtRevenueTab = () => {
  return (
    <WidgetContainer>
      <RevenueShareStateWidget end={DATA.revenueShare.endDate} />
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
