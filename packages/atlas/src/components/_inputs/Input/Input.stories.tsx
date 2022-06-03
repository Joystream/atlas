import { useRef } from '@storybook/addons'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionCancel } from '@/components/_icons'

import { Input, InputProps } from '.'

export default {
  title: 'inputs/Input',
  component: Input,
  args: {
    size: 'large',
    type: 'text',
    placeholder: 'placeholder text',
  },
  argTypes: {
    value: { table: { disable: true } },
  },
} as Meta<InputProps>

const Template: Story<InputProps> = (args) => <Input {...args} />

const TemplateWithControlledInput: Story<InputProps> = (args) => {
  const [value, setValue] = useState('')
  return <Input {...args} onChange={(e) => setValue(e.currentTarget.value)} value={value} />
}

const TemplateWithUncontrolledInput: Story<InputProps> = (args) => {
  const ref = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <Input {...args} ref={ref} />
      <Button onClick={() => alert(ref.current?.value)}>Show input value</Button>
    </>
  )
}

export const Default = Template.bind({})
Default.argTypes = {
  value: { table: { disable: false } },
}

export const WithControlledInput = TemplateWithControlledInput.bind({})

export const WithUncontrolledInput = TemplateWithUncontrolledInput.bind({})

export const WithIcons = Template.bind({})
WithIcons.args = {
  nodeStart: <SvgActionCancel />,
  nodeEnd: <Button variant="tertiary">button</Button>,
}
