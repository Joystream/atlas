import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { RatioPreview } from '@/components/RatioPreview/RatioPreview'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { RevenueShareParticipationWidget } from '@/components/_crt/RevenueShareParticipationWidget'

export const CrtRevenueTab = () => {
  return (
    <LayoutGrid>
      <GridItem colSpan={{ base: 12, sm: 4 }}>
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
