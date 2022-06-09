import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import { SvgActionAddImage } from '@/components/_icons'

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
  },
  argTypes: {
    items: { control: { disable: true } },
    value: { control: { disable: true } },
    icon: { control: { disable: true } },
    className: { control: { disable: true } },
    containerRef: { control: { disable: true } },
    ref: { control: { disable: true } },
    onChange: { control: { disable: true } },
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
