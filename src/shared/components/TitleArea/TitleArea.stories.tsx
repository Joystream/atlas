import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { TitleArea, TitleAreaProps } from './TitleArea'

export default {
  title: 'Shared/T/TitleArea',
  component: TitleArea,
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
    name: {
      table: {
        disable: true,
      },
    },
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
