import React, { useState } from 'react'
import HeaderTextField, { Variant } from './HeaderTextField'

export default {
  title: 'Shared/HeaderTextField',
  component: HeaderTextField,
  argTypes: {
    name: { control: 'text', defaultValue: 'Lorem ipsum' },
    warningText: { control: 'text', defaultValue: 'Channel title must be at least 2 character' },
    errorText: { control: 'text', defaultValue: 'Some error text' },
    variant: {
      control: {
        type: 'select',
        options: ['default', 'error', 'warning'],
      },
    },
  },
}

type StoryProps = {
  name: string
  warningText: string
  errorText: string
  variant: Variant
}

const Template = ({ name, warningText, errorText, variant }: StoryProps) => {
  const [text, setText] = useState(name)
  const input = React.useRef<HTMLInputElement>(null)

  return (
    <HeaderTextField
      ref={input}
      value={text}
      warningText={warningText}
      errorText={errorText}
      onChange={setText}
      variant={variant}
    />
  )
}

export const Regular = Template.bind({})
