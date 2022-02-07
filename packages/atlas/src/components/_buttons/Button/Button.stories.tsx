import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgActionAddVideo } from '@/components/_icons'

import { Button, ButtonProps } from './Button'

export default {
  title: 'button/Button',
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
    textOnly: { table: { disable: true } },
    iconPlacement: {
      control: { type: 'select', options: ['left', 'right'] },
      defaultValue: 'left',
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
export const Destructive = Template.bind({})
Destructive.args = {
  variant: 'destructive',
}
export const DestructiveSecondary = Template.bind({})
DestructiveSecondary.args = {
  variant: 'destructive-secondary',
}
export const Warning = Template.bind({})
Warning.args = {
  variant: 'warning',
}
export const WarningSecondary = Template.bind({})
WarningSecondary.args = {
  variant: 'warning-secondary',
}
export const WithIcon = Template.bind({})
WithIcon.args = {
  icon: <SvgActionAddVideo />,
}
const TextOnlyTemplate: Story<ButtonProps> = (args) => (
  <div>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <Button {...args} size="large">
        Large
      </Button>
      <Button {...args} size="medium">
        Medium
      </Button>
      <Button {...args} size="small">
        Small
      </Button>
    </div>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <Button {...args} size="large" variant="secondary">
        Large
      </Button>
      <Button {...args} size="medium" variant="secondary">
        Medium
      </Button>
      <Button {...args} size="small" variant="secondary">
        Small
      </Button>
    </div>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <Button {...args} size="large" variant="destructive-secondary">
        Large
      </Button>
      <Button {...args} size="medium" variant="destructive-secondary">
        Medium
      </Button>
      <Button {...args} size="small" variant="destructive-secondary">
        Small
      </Button>
    </div>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <Button {...args} size="large" variant="warning-secondary">
        Large
      </Button>
      <Button {...args} size="medium" variant="warning-secondary">
        Medium
      </Button>
      <Button {...args} size="small" variant="warning-secondary">
        Small
      </Button>
    </div>
  </div>
)

const IconOnlyTemplate: Story<ButtonProps> = (args) => (
  <>
    <Button {...args} size="large" />
    <Button {...args} size="medium" />
    <Button {...args} size="small" />
    <Button {...args} size="large" variant="secondary" />
    <Button {...args} size="medium" variant="secondary" />
    <Button {...args} size="small" variant="secondary" />
    <Button {...args} size="large" variant="tertiary" />
    <Button {...args} size="medium" variant="tertiary" />
    <Button {...args} size="small" variant="tertiary" />
    <Button {...args} size="large" variant="destructive-secondary" />
    <Button {...args} size="medium" variant="destructive-secondary" />
    <Button {...args} size="small" variant="destructive-secondary" />
    <Button {...args} size="large" variant="warning-secondary" />
    <Button {...args} size="medium" variant="warning-secondary" />
    <Button {...args} size="small" variant="warning-secondary" />
  </>
)

export const TextOnly = TextOnlyTemplate.bind({})
TextOnly.args = {
  textOnly: true,
  icon: <SvgActionAddVideo />,
}

export const IconOnly = IconOnlyTemplate.bind({})
IconOnly.args = {
  icon: <SvgActionAddVideo />,
}
