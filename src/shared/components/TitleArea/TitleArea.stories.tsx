import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { TitleArea, TitleAreaProps } from './TitleArea'

export default {
  title: 'Shared/H/TitleArea',
  component: TitleArea,
  argTypes: {
    helperText: { control: 'text', defaultValue: 'Channel title must be at least 2 character' },
    warning: { control: 'boolean' },
    error: { control: 'boolean' },
  },
} as Meta

const Template: Story<TitleAreaProps> = (args) => {
  const input = React.useRef<HTMLInputElement>(null)
  const [text, setText] = useState('Lorem ipsum')
  return <TitleArea {...args} value={text} ref={input} onChange={(e) => setText(e.target.value)} />
}

export const Controlled = Template.bind({})

const TemplateUncontrolled: Story<TitleAreaProps> = (args) => {
  const input = React.useRef<HTMLInputElement>(null)
  return <TitleArea {...args} value="Lorem ipsum" ref={input} />
}

export const Uncontrolled = TemplateUncontrolled.bind({})
