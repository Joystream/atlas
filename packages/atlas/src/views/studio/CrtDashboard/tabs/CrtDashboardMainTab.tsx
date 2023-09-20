import BN from 'bn.js'

import { SvgActionChevronR } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { TextButton } from '@/components/_buttons/Button'
import {
  BigWidgetContainer,
  HoldersPlaceholders,
  NoGlobalPaddingWrapper,
  ProgressWidgetPlaceholer,
  WidgetContainer,
} from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { StyledSvgJoyTokenMonochrome24 } from '@/views/studio/MyPaymentsView/PaymentsOverview/PaymentsOverview.styles'

export const CrtDashboardMainTab = () => {
  return (
    <>
      <NoGlobalPaddingWrapper>
        <ProgressWidgetPlaceholer>Progress Widget Placeholer</ProgressWidgetPlaceholer>
      </NoGlobalPaddingWrapper>

      <WidgetContainer>
        <WidgetTile
          title="Transferable"
          customNode={
            <NumberFormat
              value={new BN(9999999)}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
              withToken
              customTicker="$JBC"
              variant="h400"
            />
          }
        />
        <WidgetTile
          title="Locked"
          tooltip={{
            text: 'It is locked value',
          }}
          customNode={
            <NumberFormat
              value={new BN(9999999)}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
              withToken
              customTicker="$JBC"
              variant="h400"
            />
          }
        />
        <WidgetTile
          title="Total rev."
          tooltip={{
            text: 'It is locked value',
          }}
          customNode={
            <NumberFormat
              value={new BN(9999999)}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
              withToken
              customTicker="$JBC"
              variant="h400"
            />
          }
        />
        <WidgetTile
          title="Patronage"
          tooltip={{
            text: 'It is locked value',
          }}
          customNode={
            <Text variant="h400" as="h4">
              10%
            </Text>
          }
        />
      </WidgetContainer>
      <BigWidgetContainer>
        <WidgetTile
          title="Token holders"
          titleColor="colorTextStrong"
          titleVariant="h500"
          customTopRightNode={
            <TextButton iconPlacement="right" icon={<SvgActionChevronR />}>
              Show holders
            </TextButton>
          }
          customNode={<HoldersPlaceholders />}
        />
        <WidgetTile
          title="Revenue share with holders"
          titleColor="colorTextStrong"
          titleVariant="h500"
          customTopRightNode={
            <TextButton iconPlacement="right" icon={<SvgActionChevronR />}>
              Show revenue shares
            </TextButton>
          }
          customNode={<HoldersPlaceholders />}
        />
      </BigWidgetContainer>
    </>
  )
}
