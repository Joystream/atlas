import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import RadioButton from './RadioButton'

export default {
  title: 'Shared/RadioButton',
  component: RadioButton,
  args: {
    label: 'Hello there',
  },
} as Meta

const Template: Story = (args) => {
  const [selected, setSelected] = useState('1')
  return (
    <div>
      <RadioButton {...args} name="radio-group" value="1" selected={selected} onChange={setSelected} />
      <RadioButton {...args} name="radio-group" value="2" selected={selected} onChange={setSelected} />
      <RadioButton {...args} name="radio-group" value="3" selected={selected} onChange={setSelected} />
    </div>
  )
}

export const Default = Template.bind({})
