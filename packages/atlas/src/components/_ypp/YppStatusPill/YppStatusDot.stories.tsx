import { Meta, StoryFn } from '@storybook/react'

import { YppStatusDot } from '@/components/_ypp/YppStatusPill/YppStatusDot'

export default {
  title: 'components/YppStatusPill',
  component: YppStatusDot,
} as Meta

const Template: StoryFn = () => <YppStatusDot status="operational" />

export const Default = Template.bind({})
