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
    onClaim: () => undefined,
  },
} as Meta<RevenueShareWidgetProps>

export const Default: StoryFn<RevenueShareWidgetProps> = (args) => <RevenueShareWidget {...args} />
