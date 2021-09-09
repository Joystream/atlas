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
  const [text, setText] = useState('Lorem ipsum')
  return <TitleArea {...args} value={text} onChange={(e) => setText(e.target.value)} />
}

export const Controlled = Template.bind({})
