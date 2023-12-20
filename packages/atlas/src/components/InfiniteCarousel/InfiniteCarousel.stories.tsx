import { ApolloProvider } from '@apollo/client'
import { useState } from '@storybook/addons'
import { Meta, Story } from '@storybook/react'
import { MemoryRouter } from 'react-router'

import { createApolloClient } from '@/api'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { getRandomIntInclusive } from '@/utils/number'

import { InfiniteCarousel, InfiniteCarouselProps } from './InfiniteCarousel'

import { ChannelCard } from '../_channel/ChannelCard'
import { FormField } from '../_inputs/FormField'
import { Select } from '../_inputs/Select'

export default {
  title: 'other/InfiniteCarousel',
  args: {
    itemWidth: 200,
    title: 'Recently verified channels',
    subTitle: 'This is subtitle',
    informationProps: {
      multiline: true,
      text: 'This is tooltip',
    },
  },
  argTypes: {
    items: { table: { disable: true } },
    informationProps: { table: { disable: true } },
  },
  component: InfiniteCarousel,
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <MemoryRouter>
          <ApolloProvider client={apolloClient}>
            <ConfirmationModalProvider>
              <Story />
            </ConfirmationModalProvider>
          </ApolloProvider>
        </MemoryRouter>
      )
    },
  ],
} as Meta<InfiniteCarouselProps>

const ChangeableTemplate: Story<InfiniteCarouselProps> = (args) => {
  const [itemsLength, setItemsLength] = useState(15)
  const items = Array.from({ length: itemsLength }).map((_, idx) => (
    <ChannelCard
      withFollowButton={false}
      key={idx}
      channel={{
        title: idx.toString(),
        id: idx.toString(),
        followsNum: getRandomIntInclusive(0, 100),
        rewardAccount: 'dummy',
        createdAt: new Date(),
        channelStateBloatBond: '',
        cumulativeRevenue: '0',
      }}
    />
  ))
  return (
    <>
      <InfiniteCarousel {...args} items={items} />
      <FormField label="Number of items">
        <Select
          value={itemsLength}
          items={Array.from({ length: 30 }).map((_, idx) => ({ value: idx + 1, name: (idx + 1).toString() }))}
          onChange={(value) => setItemsLength(value || 0)}
        />
      </FormField>
    </>
  )
}
export const Default = ChangeableTemplate.bind({})
