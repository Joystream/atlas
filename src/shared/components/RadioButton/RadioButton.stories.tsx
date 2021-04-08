import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import RadioButton from './RadioButton'
import { template } from 'lodash'

export default {
  title: 'Shared/RadioButton',
  component: RadioButton,
  args: {
    label: 'Hello there',
    helperText: 'Caption',
  },
} as Meta

const Template: Story = (args) => {
  const [selected, setSelected] = useState<string | number>('1')
  const handleClick: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    const element = e.currentTarget as HTMLInputElement
    setSelected(element.value)
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridGap: '12px' }}>
      <RadioButton {...args} name="radio-group" value="1" selectedValue={selected} onClick={handleClick} />
      <RadioButton {...args} name="radio-group" value="2" selectedValue={selected} onClick={handleClick} />
      <RadioButton {...args} name="radio-group" value="3" selectedValue={selected} onClick={handleClick} />
    </div>
  )
}

export const Default = Template.bind({})
