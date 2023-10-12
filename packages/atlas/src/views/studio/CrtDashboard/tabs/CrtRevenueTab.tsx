import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { RatioPreview } from '@/components/RatioPreview/RatioPreview'
import { WidgetTile } from '@/components/WidgetTile'
import { RevenueShareParticipationWidget } from '@/components/_crt/RevenueShareParticipationWidget'
import { RevenueShareStateWidget } from '@/components/_crt/RevenueShareStateWidget'

const DATA = {
  revenueShare: {
    endDate: new Date(Date.now() + 1000000),
  },
}

export const CrtRevenueTab = () => {
  return (
    <LayoutGrid>
      <GridItem colSpan={{ base: 12, sm: 4 }}>
        <RevenueShareStateWidget end={DATA.revenueShare.endDate} />
      </GridItem>
      <GridItem colSpan={{ base: 12, sm: 4 }}>
        <WidgetTile
          title="CHANNEL BALANCE"
          customNode={
            <NumberFormat value={200} icon={<SvgJoyTokenMonochrome24 />} variant="h500" as="p" withDenomination />
          }
          tooltip={{
            text: 'Lorem ipsum',
          }}
        />
      </GridItem>
      <GridItem colSpan={{ base: 12, sm: 4 }}>
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
      </GridItem>
      <GridItem colSpan={{ base: 12 }}>
        <RevenueShareParticipationWidget />
      </GridItem>
    </LayoutGrid>
  )
}
