import React, { useState } from 'react'
import TextField from '.'
import { Meta, Story } from '@storybook/react'
import { TextFieldProps } from './TextField'

export default {
  title: 'Shared/TextField',
  component: TextField,
  args: {
    label: 'label text',
    disabled: false,
    helperText: '',
    warning: '',
    error: '',
    required: false,
    type: 'email',
  },
  argTypes: {
    type: {
      control: {
        type: 'inline-radio',
        options: ['email', 'password', 'search', 'text'] as TextFieldProps['type'][],
      },
    },
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
