import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import RadioButton from './RadioButton'

export default {
  title: 'Shared/RadioButton',
  component: RadioButton,
  args: {
    label: 'Hello there',
    value: false,
  },
} as Meta

const Template: Story = (args) => {
  const [radioSelect, setRadioSelect] = useState(0)
  return (
    <div>
      <RadioButton {...args} defaultChecked={radioSelect === 0} onClick={() => setRadioSelect(0)} />
      <RadioButton {...args} defaultChecked={radioSelect === 1} onClick={() => setRadioSelect(1)} />
      <RadioButton {...args} defaultChecked={radioSelect === 2} onClick={() => setRadioSelect(2)} />
    </div>
  )
}

export const Default = Template.bind({})
