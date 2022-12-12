import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { TitleInput, TitleInputProps } from './TitleInput'

export default {
  title: 'inputs/TitleInput',
  component: TitleInput,
  argTypes: {
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    className: { table: { disable: true } },
    value: { table: { disable: true } },
    name: { table: { disable: true } },
  },
  args: {
    min: 3,
    max: 30,
    placeholder: 'Type here',
    variant: 'small',
  },
} as Meta

const Template: StoryFn<TitleInputProps> = (args) => {
  const [text, setText] = useState('')
  return (
    <div style={{ maxWidth: '400px' }}>
      <TitleInput {...args} value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  )
}

export const Controlled = Template.bind({})
