import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgGlyphAddVideo } from '@/shared/icons'

import { IconButtonProps, IconButton } from '.'

export default {
  title: 'Shared/I/IconButton',
  component: IconButton,
  argTypes: {
    size: { table: { disable: true } },
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
    to: { table: { disable: true } },
    type: { table: { disable: true } },
    variant: { table: { disable: true } },
  },
} as Meta

const Template: Story<IconButtonProps> = (args) => (
  <>
    <IconButton {...args} size="large">
      <SvgGlyphAddVideo />
    </IconButton>
    <IconButton {...args} size="medium">
      <SvgGlyphAddVideo />
    </IconButton>
    <IconButton {...args} size="small">
      <SvgGlyphAddVideo />
    </IconButton>
  </>
)

export const Primary = Template.bind({})
Primary.args = {
  variant: 'primary',
}

export const Secondary = Template.bind({})
Secondary.args = {
  variant: 'secondary',
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  variant: 'tertiary',
}
