import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Switch, SwitchProps } from './Switch'

export default {
  title: 'inputs/Switch',
  component: Switch,
  args: {
    disabled: false,
    label: 'Switch button label',
    isLabelTitle: false,
  },
} as Meta

const Template: Story<SwitchProps> = (args) => <Switch {...args} />

export const Default = Template.bind({})
