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
  const [selected, setSelected] = useState<string | number>('1')
  const handleClick: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    const element = e.currentTarget as HTMLInputElement
    setSelected(element.value)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <RadioButton {...args} name="radio-group" value="1" selectedValue={selected} onClick={handleClick} />
      <RadioButton {...args} name="radio-group" value="2" selectedValue={selected} onClick={handleClick} />
      <RadioButton {...args} name="radio-group" value="3" selectedValue={selected} onClick={handleClick} />
    </div>
  )
}

export const Default = Template.bind({})
