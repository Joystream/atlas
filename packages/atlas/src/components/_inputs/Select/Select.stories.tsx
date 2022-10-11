import { Meta, Story } from '@storybook/react'
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
    size: { control: { type: 'select', options: ['medium', 'large'] } },
    items: { table: { disable: true } },
    value: { table: { disable: true } },
    icon: { table: { disable: true } },
    className: { table: { disable: true } },
    containerRef: { table: { disable: true } },
    ref: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
} as Meta<SelectProps>

const Template: Story<SelectProps> = (args) => <Select {...args} />

const TemplateWithControlledInput: Story<SelectProps> = (args) => {
  const [value, setValue] = useState<string | null>(null)
  return <Select {...args} onChange={(value) => setValue(value ?? null)} value={value} />
}

export const Default = Template.bind({})

export const WithControlledInput = TemplateWithControlledInput.bind({})

export const WithIcon = TemplateWithControlledInput.bind({})

WithIcon.args = {
  icon: <SvgActionAddImage />,
}
