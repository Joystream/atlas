import React from 'react'
import Button, { ButtonProps } from './Button'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/Button',
  component: Button,
  argTypes: {
    icon: { table: { disable: true } },
    containerCss: { table: { disable: true } },
    className: { table: { disable: true } },
    onClick: { table: { disable: true } },
    size: { table: { disable: true } },
    full: { table: { disable: true } },
  },
} as Meta

const SingleTemplate: Story<ButtonProps> = (args) => <Button {...args}>Regular</Button>

const Template: Story<ButtonProps> = (args) => (
  <>
    <Button {...args} size="regular">
      Regular
    </Button>
    <Button {...args} size="small">
      Small
    </Button>
    <Button {...args} size="smaller">
      Smaller
    </Button>
  </>
)

export const Single = SingleTemplate.bind({})
Single.argTypes = {
  size: { table: { disable: false } },
  full: { table: { disable: false } },
}
export const WithIcon = Template.bind({})
WithIcon.args = {
  icon: 'block',
}
export const Primary = Template.bind({})
export const Secondary = Template.bind({})
Secondary.args = {
  variant: 'secondary',
}
export const Tertiary = Template.bind({})
Tertiary.args = {
  variant: 'tertiary',
}
