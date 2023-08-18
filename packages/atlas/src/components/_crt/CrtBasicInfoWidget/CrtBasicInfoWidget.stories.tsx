import { Meta, StoryFn } from '@storybook/react'

import { CrtBasicInfoWidget, CrtBasicInfoWidgetProps } from '@/components/_crt/CrtBasicInfoWidget/CrtBasicInfoWidget'

export default {
  title: 'crt/CrtBasicInfoWidget',
  component: CrtBasicInfoWidget,
} as Meta<CrtBasicInfoWidgetProps>

const Template: StoryFn<CrtBasicInfoWidgetProps> = (args) => <CrtBasicInfoWidget {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'CRT',
  revenueShare: 60,
  creatorReward: 60,
  totalRevenue: '65656',
}
