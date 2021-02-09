import React, { useState } from 'react'
import Select, { SelectProps, SelectedItem } from '.'
import { Story, Meta } from '@storybook/react'

const items: SelectedItem[] = [
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
    disabled: false,
    error: '',
    helperText: '',
    warning: '',
  },
} as Meta

const Template: Story<SelectProps> = (args) => <Select {...args} />

const TemplateWithControlledInput: Story<SelectProps> = (args) => {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  return (
    <Select
      {...args}
      onChange={({ selectedItem }) => selectedItem && setSelectedItem(selectedItem)}
      value={selectedItem}
    />
  )
}

export const Default = Template.bind({})

export const WithControlledInput = TemplateWithControlledInput.bind({})
