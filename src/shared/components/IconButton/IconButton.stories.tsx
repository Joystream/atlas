import React from 'react'
import { Meta, Story } from '@storybook/react'
import IconButton, { IconButtonProps } from '.'

export default {
  title: 'Shared/IconButton',
  component: IconButton,
  argTypes: {
    icon: {
      defaultValue: 'add-video',
    },
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
    <IconButton {...args} size="large" />
    <IconButton {...args} size="medium" />
    <IconButton {...args} size="small" />
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
