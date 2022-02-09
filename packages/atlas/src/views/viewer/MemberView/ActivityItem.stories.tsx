import { Meta, Story } from '@storybook/react'
import React from 'react'

import { GridItem, LayoutGrid } from '@/components/LayoutGrid'

import { ActivityItem, ActivityItemProps } from './ActivityItem'

export default {
  title: 'Other/ActivityItem',
  component: ActivityItem,
  args: {
    activity: [
      {
        date: new Date('11 Nov 2021, 20:25'),
        type: 'Bid',
        title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
        description: 'Bedeho placed a bid for ツ 32K ',
        thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
      },
      {
        date: new Date('11 Nov 2021, 20:25'),
        type: 'Withdrawl',
        title: 'AMSTERDAM LIGHT FESTIVAL - TRAVEL VLOG 220ENTERP...',
        description: 'Bedeho purchased NFT for ツ 32,5M ',
        thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
      },
      {
        date: new Date('11 Nov 2021, 20:25'),
        type: 'Purchase',
        title: 'Did An Alternate Reality Game Gone Wrong Predict QAnon?',
        description: 'Bedeho won auction with ツ 11,2K  ',
        thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
      },
      {
        date: new Date('11 Nov 2021, 20:25'),
        type: 'Purchase',
        title: 'EVERYTHING YOU LOVE & EXPERIENCE ABOUT TRAVEL',
        description: 'Bedeho placed a bid for ツ 32K ',
        thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
      },
      {
        date: new Date('11 Nov 2021, 20:25'),
        type: 'Sale',
        title: 'closer',
        description: 'Bedeho sold NFT for ツ 98,6K to Lenorette ',
        thumnailUri: 'https://atlas-dev.joystream.app/distributor-1/api/v1/assets/21',
      },
    ],
  },
} as Meta

const Template: Story<{ activity: Array<ActivityItemProps> }> = ({ activity }) => {
  return (
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
              />
            </GridItem>
          ))}
        </LayoutGrid>
      </GridItem>
    </LayoutGrid>
  )
}

export const Default = Template.bind({})
