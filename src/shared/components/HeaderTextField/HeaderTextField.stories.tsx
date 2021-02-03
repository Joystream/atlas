import React, { useState } from 'react'
import HeaderTextField, { HeaderTextFieldProps } from './HeaderTextField'
import { Story } from '@storybook/react'

export default {
  title: 'Shared/HeaderTextField',
  component: HeaderTextField,
}

const Template: Story<HeaderTextFieldProps> = () => {
  const [text, setText] = useState('Lorem ipsum dolor sit amet')
  const input = React.useRef<HTMLInputElement>(null)

  return (
    <HeaderTextField
      ref={input}
      value={text}
      helperText="Click to edit channel title!"
      errorText="Channel title must be at least 2 character"
      onChange={setText}
      variant={text.length < 2 ? 'error' : 'default'}
    />
  )
}

export const Regular = Template.bind({})
