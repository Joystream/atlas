import React, { useState } from 'react'
import Select from '.'
import { SelectProps, SelectedItem } from './Select'
import { Story, Meta } from '@storybook/react'

const items = [
  { name: 'first', value: 'first' },
  { name: 'second', value: 'second' },
  { name: 'third', value: 'third' },
]

export default {
  title: 'Shared/Select',
  component: Select,
  args: {
    items,
    label: 'change value',
    placeholder: 'placeholder',
  },
} as Meta

const Template: Story<SelectProps> = (args) => <Select {...args} />

const TemplateWithControlledInput: Story<SelectProps> = (args) => {
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    value: 'selected value',
    name: 'selected value',
  })
  return (
    <Select
      {...args}
      onChange={({ selectedItem }) => selectedItem && setSelectedItem(selectedItem)}
      value={selectedItem}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  label: '',
  placeholder: '',
  disabled: false,
  error: '',
  helperText: '',
  warning: '',
}

export const WithControlledInput = TemplateWithControlledInput.bind({})

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
}

export const Error = Template.bind({})
Error.args = {
  error: 'Some Error!',
}

export const Warning = Template.bind({})
Warning.args = {
  warning: 'Some warning!',
}
