import { Meta, Story } from '@storybook/react'
import React from 'react'

import { IconWrapper, IconWrapperProps } from './IconWrapper'

import { SvgActionTrash, SvgControlsSettingsOutline } from '..'

export default {
  title: 'Icons/IconWrapper',
  component: IconWrapper,
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      defaultValue: 'medium',
    },
  },
} as Meta

const TemplateSingle: Story<IconWrapperProps> = (args) => (
  <div>
    <IconWrapper {...args} />
  </div>
)

export const ActionIcon = TemplateSingle.bind({})
ActionIcon.args = {
  icon: <SvgActionTrash />,
}

export const ControlIcon = TemplateSingle.bind({})
ControlIcon.args = {
  icon: <SvgControlsSettingsOutline />,
}
