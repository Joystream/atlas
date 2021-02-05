import React, { useState } from 'react'
import TextField, { TextFieldProps } from '.'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/TextField',
  component: TextField,
  args: {
    label: 'label text',
  },
} as Meta

const Template: Story<TextFieldProps> = (args) => <TextField {...args} />

const TemplateWithControlledInput: Story<TextFieldProps> = (args) => {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  return (
    <TextField
      {...args}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      helperText={isFocused ? 'focused' : 'not focused'}
    />
  )
}

export const Default = Template.bind({})

export const WithControlledInput = TemplateWithControlledInput.bind({})
