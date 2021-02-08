import React, { useState } from 'react'
import HeaderTextField, { HeaderTextFieldProps } from './HeaderTextField'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/HeaderTextField',
  component: HeaderTextField,
  argTypes: {
    helperText: { control: 'text', defaultValue: 'Channel title must be at least 2 character' },
    warning: { control: 'boolean' },
    error: { control: 'boolean' },
  },
} as Meta

const Template: Story<HeaderTextFieldProps> = (args) => {
  const input = React.useRef<HTMLInputElement>(null)
  const [text, setText] = useState('Lorem ipsum')
  return <HeaderTextField {...args} value={text} ref={input} onChange={(e) => setText(e.target.value)} />
}

export const Controlled = Template.bind({})

const TemplateUncontrolled: Story<HeaderTextFieldProps> = (args) => {
  const input = React.useRef<HTMLInputElement>(null)
  return <HeaderTextField {...args} value="Lorem ipsum" ref={input} />
}

export const Uncontrolled = TemplateUncontrolled.bind({})
