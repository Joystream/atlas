import styled from '@emotion/styled'
import { useState } from 'react'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronR, SvgActionRevenueShare } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { PieDatum } from '@/components/_charts/PieChart'
import { Widget } from '@/components/_crt/CrtStatusWidget/CrtStatusWidget.styles'
import { useUser } from '@/providers/user/user.hooks'

export type CrtHoldersWidgetProps = {
  token: FullCreatorTokenFragment
}

export const CrtRevenueShareWidget = ({ token }: CrtHoldersWidgetProps) => {
  const { activeMembership } = useUser()
  const [hoveredHolder, setHoveredHolder] = useState<PieDatum | null>(null)

  return (
    <Widget
      title="Holders"
      titleVariant="h500"
      titleColor="colorTextStrong"
      customTopRightNode={
        <TextButton iconPlacement="right" icon={<SvgActionChevronR />}>
          Show revenue shares
        </TextButton>
      }
      customNode={
        <FlexBox flow="column" height="100%" width="100%" gap={4}>
          <FlexBox width="100%" justifyContent="space-between">
            <FlexBox flow="column">
              <Text variant="h100" as="h1" color="colorTextMuted">
                CURRENT STATE
              </Text>
              <Text variant="t300" as="p" color="colorText">
                No active share
              </Text>
            </FlexBox>
            <FlexBox flow="column">
              <Text variant="h100" as="h1" color="colorTextMuted">
                REVENUE SHARE RATIO
              </Text>
              <Text variant="t300" as="p">
                Channel 80%, Holders 20%
              </Text>
            </FlexBox>
          </FlexBox>
          <EmptyState />
        </FlexBox>
      }
    />
  )
}

const EmptyState = () => {
  return (
    <EmptyStateBox justifyContent="center" alignItems="center" flow="column">
      <div style={{ height: 100, width: 200, background: 'red' }} />
      <Text variant="t200" as="p" color="colorText" margin={{ top: 6, bottom: 2 }}>
        There is no ongoing share of revenue. Click start revenue share to to withdraw your share and let your tokens
        holders claim their share
      </Text>
      <Button variant="secondary" icon={<SvgActionRevenueShare />}>
        Start revenue share
      </Button>
    </EmptyStateBox>
  )
}

const EmptyStateBox = styled(FlexBox)`
  padding: 0 15%;
  text-align: center;
  height: 100%;
`
