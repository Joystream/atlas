import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgNavPopular } from '@/components/icons'

import { CallToActionButton, CallToActionButtonProps, CallToActionWrapper } from '.'

export default {
  title: 'button/CallToActionButton',
  component: CallToActionButton,
  argTypes: {
    colorVariant: {
      control: { type: 'select', options: ['blue', 'green', 'red', 'yellow'] },
      defaultValue: 'blue',
    },
  },
} as Meta

const Template: Story<CallToActionButtonProps> = (args) => {
  return (
    <CallToActionWrapper>
      <CallToActionButton {...args} />
    </CallToActionWrapper>
  )
}
export const Default = Template.bind({})
Default.args = {
  label: 'Call To Action Button',
  icon: <SvgNavPopular />,
}
