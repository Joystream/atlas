import { Meta, Story } from '@storybook/react'
import { MouseEvent, useState } from 'react'

import { RadioInput, RadioInputProps } from './RadioInput'

export default {
  title: 'inputs/RadioInput',
  component: RadioInput,
  args: {
    disabled: false,
    error: false,
  },
} as Meta

const Template: Story<RadioInputProps> = (args) => {
  const [selected, setSelected] = useState<string | number>('1')
  const handleClick: (e: MouseEvent<HTMLElement>) => void = (e) => {
    const element = e.currentTarget as HTMLInputElement
    setSelected(element.value)
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridGap: '12px' }}>
      <RadioInput {...args} name="radio-group" value="1" selectedValue={selected} onClick={handleClick} />
      <RadioInput {...args} name="radio-group" value="2" selectedValue={selected} onClick={handleClick} />
      <RadioInput {...args} name="radio-group" value="3" selectedValue={selected} onClick={handleClick} />
    </div>
  )
}

export const Default = Template.bind({})
