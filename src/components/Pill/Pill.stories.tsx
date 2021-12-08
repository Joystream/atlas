import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgActionAddVideo } from '@/components/_icons'

import { Pill } from './Pill'
import { PillProps } from './types'

export default {
  title: 'Other/Pill',
  component: Pill,
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      defaultValue: 'small',
    },
    variant: {
      control: { type: 'select', options: ['default', 'overlay', 'danger'] },
      defaultValue: 'default',
    },
    icon: {
      control: false,
    },
    iconPlacement: {
      options: ['left', 'right'],
      control: { type: 'inline-radio' },
      defaultValue: 'left',
    },
  },
  args: {
    label: 'Pill Component',
  },
} as Meta

const Template: Story<PillProps> = (args) => <Pill {...args} />

export const Default = Template.bind({})
export const Icon = Template.bind({})
Icon.args = {
  icon: <SvgActionAddVideo />,
}
