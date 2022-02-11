import React from 'react'

import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { Text } from '@/components/Text'
import { SvgActionBid, SvgActionBuyNow, SvgActionMint, SvgActionSell } from '@/components/_icons'
import { IconWrapper } from '@/components/_icons/IconWrapper'

import { ActivityItem, ActivityItemProps } from './ActivityItem'
import { GridRowWrapper, OverviewContainer, OverviewItem, OverviewTextContainer } from './MemberActivity.styles'

const activity: Array<ActivityItemProps> = [
  {
    date: new Date('11 Nov 2021, 20:25'),
    type: 'Bid',
    title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
    description: 'Bedeho placed a bid for  ',
    joy: 32000,
    thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
  },
  {
    date: new Date('11 Nov 2021, 20:25'),
    type: 'Withdrawl',
    title: 'AMSTERDAM LIGHT FESTIVAL - TRAVEL VLOG 220ENTERP...',
    description: 'Bedeho purchased NFT for ',
    joy: 325000000,
    thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
  },
  {
    date: new Date('11 Nov 2021, 20:25'),
    type: 'Purchase',
    title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
    description: 'Bedeho won auction with  ',
    joy: 112000,
    thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
  },
  {
    date: new Date('11 Nov 2021, 20:25'),
    type: 'Purchase',
    title: 'EVERYTHING YOU LOVE & EXPERIENCE ABOUT TRAVEL',
    description: 'Bedeho placed a bid for ',
    joy: 32000,
    thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
  },
  {
    date: new Date('11 Nov 2021, 20:25'),
    type: 'Sale',
    title: 'closer',
    description: 'Bedeho sold NFT for  to Lenorette ',
    joy: 986000,
    thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
  },
]

//TODO: Fetch activity from member
//TODO: infinite scrolling
//TODO: Sorting activity by newest oldest
export const MemberActivity = () => {
  return (
    <section>
      {activity.length === 0 ? (
        <EmptyFallback title="No activity" subtitle="Go out there and explore!" variant="small" />
      ) : (
        <LayoutGrid>
          <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
            <LayoutGrid>
              {activity?.map((activity, i) => (
                <GridItem key={i} colSpan={{ base: 12 }}>
                  <ActivityItem
                    date={activity.date}
                    type={activity.type}
                    title={activity.title}
                    description={activity.description}
                    thumnailUri={activity.thumnailUri}
                    joy={activity.joy}
                  />
                </GridItem>
              ))}
            </LayoutGrid>
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
      )}
    </section>
  )
}
