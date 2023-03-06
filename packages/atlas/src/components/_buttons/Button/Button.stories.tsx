import { Meta, StoryFn } from '@storybook/react'

import { SvgActionAddVideo } from '@/assets/icons'

import { Button, ButtonProps, TextButton, TextButtonProps } from './Button'

export default {
  title: 'button/Button',
  component: Button,
  argTypes: {
    size: { table: { disable: true } },
  },
} as Meta

const Template: StoryFn<ButtonProps> = (args) => (
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
const TextOnlyTemplate: StoryFn<TextButtonProps> = (args) => (
  <div>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'end' }}>
      <TextButton {...args} size="large">
        Large
      </TextButton>
      <TextButton {...args} size="medium">
        Medium
      </TextButton>
      <TextButton {...args} size="small">
        Small
      </TextButton>
    </div>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'end' }}>
      <TextButton {...args} size="large" variant="secondary">
        Large
      </TextButton>
      <TextButton {...args} size="medium" variant="secondary">
        Medium
      </TextButton>
      <TextButton {...args} size="small" variant="secondary">
        Small
      </TextButton>
    </div>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'end' }}>
      <TextButton {...args} size="large" variant="destructive">
        Large
      </TextButton>
      <TextButton {...args} size="medium" variant="destructive">
        Medium
      </TextButton>
      <TextButton {...args} size="small" variant="destructive">
        Small
      </TextButton>
    </div>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'end' }}>
      <TextButton {...args} size="large" variant="warning">
        Large
      </TextButton>
      <TextButton {...args} size="medium" variant="warning">
        Medium
      </TextButton>
      <TextButton {...args} size="small" variant="warning">
        Small
      </TextButton>
    </div>
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'end' }}>
      <TextButton {...args} size="large" variant="tertiary">
        Large
      </TextButton>
      <TextButton {...args} size="medium" variant="tertiary">
        Medium
      </TextButton>
      <TextButton {...args} size="small" variant="tertiary">
        Small
      </TextButton>
    </div>
  </div>
)

const IconOnlyTemplate: StoryFn<ButtonProps> = (args) => (
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
    <Button {...args} size="large" variant="destructive" />
    <Button {...args} size="medium" variant="destructive" />
    <Button {...args} size="small" variant="destructive" />
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
  icon: <SvgActionAddVideo />,
}

export const IconOnly = IconOnlyTemplate.bind({})
IconOnly.args = {
  icon: <SvgActionAddVideo />,
}
