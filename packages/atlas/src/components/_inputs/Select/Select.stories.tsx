import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { SvgActionAddImage } from '@/assets/icons'

import { Select, SelectItem, SelectProps } from '.'

const items: SelectItem[] = [
  { name: 'first', value: 'first' },
  { name: 'second', value: 'second' },
  { name: 'third', value: 'third' },
]

export default {
  title: 'inputs/Select',
  component: Select,
  args: {
    items,
    size: 'large',
    disabled: false,
    error: false,
  },
  argTypes: {
    items: { table: { disable: true } },
    value: { table: { disable: true } },
    icon: { table: { disable: true } },
    containerRef: { table: { disable: true } },
    ref: { table: { disable: true } },
  },
} as Meta<SelectProps>

const Template: StoryFn<SelectProps> = (args) => <Select {...args} />

const TemplateWithControlledInput: StoryFn<SelectProps> = (args) => {
  const [value, setValue] = useState<string | null>(null)
  return <Select {...args} onChange={(value) => setValue(value ?? null)} value={value} />
}

export const Default = Template.bind({})

export const WithControlledInput = TemplateWithControlledInput.bind({})

export const WithIcon = TemplateWithControlledInput.bind({})

const TemplateWithSeparator: StoryFn<SelectProps> = (args) => (
  <Select
    {...args}
    items={[
      { name: 'TOP ITEMS', value: '', isSeparator: true },
      ...args.items.slice(0, 2),
      { name: 'ALL ITEMS', value: '', isSeparator: true },
      ...args.items,
    ]}
  />
)

export const WithSeparators = TemplateWithSeparator.bind({})

WithIcon.args = {
  icon: <SvgActionAddImage />,
}
