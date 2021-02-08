import React, { useState } from 'react'
import HeaderTextField, { Variant } from './HeaderTextField'

export default {
  title: 'Shared/HeaderTextField',
  component: HeaderTextField,
  argTypes: {
    name: { control: 'text', defaultValue: 'Lorem ipsum' },
    helperText: { control: 'text', defaultValue: 'Channel title must be at least 2 character' },
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
  helperText: string
  variant: Variant
}

const Template = ({ name, helperText, variant }: StoryProps) => {
  const [text, setText] = useState(name)
  const input = React.useRef<HTMLInputElement>(null)

  return <HeaderTextField ref={input} value={text} helperText={helperText} onChange={setText} variant={variant} />
}

export const Regular = Template.bind({})
