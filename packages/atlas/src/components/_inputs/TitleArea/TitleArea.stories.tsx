import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import { TitleArea, TitleAreaProps } from './TitleArea'

export default {
  title: 'inputs/TitleArea',
  component: TitleArea,
  args: {
    min: 3,
    max: 30,
    placeholder: 'Type here',
    variant: 'small',
  },
} as Meta

const Template: Story<TitleAreaProps> = (args) => {
  const [text, setText] = useState('Lorem ipsum')
  return (
    <div style={{ maxWidth: '400px' }}>
      <TitleArea {...args} value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  )
}

export const Controlled = Template.bind({})
