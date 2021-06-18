import { css } from '@emotion/react'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { Select, SelectItem, SelectProps } from '.'

const items: SelectItem[] = [
  { name: 'first', value: 'first' },
  { name: 'second', value: 'second' },
  { name: 'third', value: 'third' },
]

export default {
  title: 'Shared/S/Select',
  component: Select,
  args: {
    items,
    label: 'change value',
    placeholder: 'placeholder',
    disabled: false,
    error: '',
    helperText: '',
    warning: '',
  },
} as Meta

const Template: Story<SelectProps> = (args) => <Select {...args} />

const TemplateWithControlledInput: Story<SelectProps> = (args) => {
  const [value, setValue] = useState<string | null>(null)
  return <Select {...args} onChange={(value) => setValue(value ?? null)} value={value} />
}

export const Default = Template.bind({})

export const WithControlledInput = TemplateWithControlledInput.bind({})
