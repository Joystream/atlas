import { Meta, StoryFn } from '@storybook/react'

import { RevenueShareWidget, RevenueShareWidgetProps } from '@/components/_crt/RevenueShareWidget/RevenueShareWidget'

export default {
  title: 'crt/RevenueShareWidget',
  component: RevenueShareWidget,
  args: {
    tokenName: 'JBC',
    memberId: '1',
    revenueShare: {
      startingAt: 10,
      endsAt: 12,
      stakers: [],
    },
    tokenId: '1',
  } as unknown as RevenueShareWidgetProps,
} as Meta<RevenueShareWidgetProps>

const Template: StoryFn<RevenueShareWidgetProps> = (args) => <RevenueShareWidget {...args} />

export const Default = Template.bind({})
