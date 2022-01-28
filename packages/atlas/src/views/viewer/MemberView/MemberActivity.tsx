import React from 'react'
import { useParams } from 'react-router'

import { useMemberships } from '@/api/hooks'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { Text } from '@/components/Text'
import { SvgActionBid, SvgActionBuyNow, SvgActionMint, SvgActionSell } from '@/components/_icons'
import { IconWrapper } from '@/components/_icons/IconWrapper'

import { GridRowWrapper, OverviewContainer, OverviewItem, OverviewTextContainer } from './MemberActivity.styles'

export const MemberActivity = () => {
  const { handle } = useParams()
  const { memberships } = useMemberships({ where: { handle_eq: handle } })
  const member = memberships?.find((member) => member.handle === handle)

  return (
    <LayoutGrid>
      <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
        list items
      </GridItem>
      <GridItem colSpan={{ base: 12, sm: 3 }} colStart={{ sm: -4 }}>
        <Text variant="h500">Overview</Text>

        <OverviewContainer>
          <OverviewItem>
            <IconWrapper icon={<SvgActionBuyNow />} size="large" />
            <OverviewTextContainer>
              <Text variant="t100" secondary>
                Bought
              </Text>
              <Text variant="t300">120</Text>
            </OverviewTextContainer>
          </OverviewItem>
          <OverviewItem>
            <IconWrapper icon={<SvgActionSell />} size="large" />
            <OverviewTextContainer>
              <Text variant="t100" secondary>
                Sold
              </Text>
              <Text variant="t300">80</Text>
            </OverviewTextContainer>
          </OverviewItem>
          <GridRowWrapper>
            <OverviewItem>
              <IconWrapper icon={<SvgActionMint />} size="large" />
              <OverviewTextContainer>
                <Text variant="t100" secondary>
                  Created
                </Text>
                <Text variant="t300">5</Text>
              </OverviewTextContainer>
            </OverviewItem>
            <OverviewItem>
              <IconWrapper icon={<SvgActionBid />} size="large" />
              <OverviewTextContainer>
                <Text variant="t100" secondary>
                  Bidding
                </Text>
                <Text variant="t300">10</Text>
              </OverviewTextContainer>
            </OverviewItem>
          </GridRowWrapper>
        </OverviewContainer>
      </GridItem>
    </LayoutGrid>
  )
}

/* const Activity = (state) */
