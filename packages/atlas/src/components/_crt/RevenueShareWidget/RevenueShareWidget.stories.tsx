import { Meta, StoryFn } from '@storybook/react'

import { RevenueShareWidget, RevenueShareWidgetProps } from '@/components/_crt/RevenueShareWidget/RevenueShareWidget'

export default {
  title: 'crt/RevenueShareWidget',
  component: RevenueShareWidget,
  args: {
    tokenName: 'CBC',
    userShare: 200,
    userTokens: 150,
    shareEndDate: new Date(),
    onAction: () => undefined,
    status: 'active',
  },
} as Meta<RevenueShareWidgetProps>

const Template: StoryFn<RevenueShareWidgetProps> = (args) => <RevenueShareWidget {...args} />

export const Active = Template.bind({})
Active.args = {
  status: 'active',
}

export const Upcoming = Template.bind({})
Upcoming.args = {
  status: 'upcoming',
}
