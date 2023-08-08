import { Meta, StoryFn } from '@storybook/react'

import { YppStatusPill, YppStatusPillProps } from '@/components/_ypp/YppStatusPill/YppStatusPill'

export default {
  title: 'components/YppStatusPill',
  component: YppStatusPill,
} as Meta<YppStatusPillProps>

const Template: StoryFn<YppStatusPillProps> = (args) => <YppStatusPill {...args} />

export const Default = Template.bind({})
Default.args = {
  status: 'operational',
}
