import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgGlyphAddVideo } from '@/shared/icons'

import { Button, ButtonProps } from './Button'

export default {
  title: 'Shared/B/Button',
  component: Button,
  argTypes: {
    size: { table: { disable: true } },
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
    to: { table: { disable: true } },
    type: { table: { disable: true } },
    variant: { table: { disable: true } },
    fullWidth: {
      table: { disable: false, type: { summary: 'boolean' }, defaultValue: { summary: false } },
      type: { name: 'boolean', required: false },
      defaultValue: false,
    },
  },
} as Meta

const Template: Story<ButtonProps> = (args) => (
  <>
    <Button {...args} size="large">
      Large
    </Button>
    <Button {...args} size="medium">
      Medium
    </Button>
    <Button {...args} size="small">
      Small
    </Button>
  </>
)

export const Primary = Template.bind({})
export const Secondary = Template.bind({})
Secondary.args = {
  variant: 'secondary',
}
export const Tertiary = Template.bind({})
Tertiary.args = {
  variant: 'tertiary',
}
export const WithIcon = Template.bind({})
WithIcon.args = {
  icon: <SvgGlyphAddVideo />,
}
