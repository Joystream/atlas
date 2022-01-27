import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgActionAddVideo } from '@/components/_icons'

import { Pill } from './Pill'
import { PillGroup } from './PillGroup'
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
  },
  args: {
    label: 'Pill Component',
  },
} as Meta

const Template: Story<PillProps> = (args) => <Pill {...args} />
const TemplateGroup: Story<PillProps> = (args) => (
  <PillGroup items={Array.from({ length: 6 }).map(() => args)} size={args.size} />
)

export const Default = Template.bind({})
export const Icon = Template.bind({})
export const Group = TemplateGroup.bind({})
Icon.args = {
  icon: <SvgActionAddVideo />,
}
Icon.argTypes = {
  iconPlacement: {
    options: ['left', 'right'],
    control: { type: 'inline-radio' },
    defaultValue: 'left',
  },
}
