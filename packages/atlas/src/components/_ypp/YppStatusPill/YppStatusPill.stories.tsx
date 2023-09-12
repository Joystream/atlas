import { Meta, StoryFn } from '@storybook/react'

import { YppStatusPill } from '@/components/_ypp/YppStatusPill/YppStatusPill'

export default {
  title: 'components/YppStatusPill',
  component: YppStatusPill,
} as Meta

const Template: StoryFn = () => <YppStatusPill />

export const Default = Template.bind({})
