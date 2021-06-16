import { css } from '@emotion/react'
import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'

import { SelectProps, SelectItem, Select } from '.'

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

const Template: Story<SelectProps> = (args) => (
  <Select
    {...args}
    css={css`
      max-width: 400px;
    `}
  />
)

const TemplateWithControlledInput: Story<SelectProps> = (args) => {
  const [value, setValue] = useState<string | null>(null)
  return (
    <Select
      {...args}
      onChange={(value) => setValue(value ?? null)}
      value={value}
      css={css`
        max-width: 400px;
      `}
    />
  )
}

export const Default = Template.bind({})

export const WithControlledInput = TemplateWithControlledInput.bind({})
