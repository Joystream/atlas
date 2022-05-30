import { useRef, useState } from '@storybook/addons'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionCancel } from '@/components/_icons'

import { Input, TextFieldProps } from '.'

export default {
  title: 'inputs/Input',
  component: Input,
  args: {
    label: 'label text',
    placeholder: 'placeholder text',
  },
  argTypes: {
    value: { table: { disable: true } },
  },
} as Meta

const Template: Story<TextFieldProps> = (args) => <Input {...args} />

const TemplateWithControlledInput: Story<TextFieldProps> = (args) => {
  const [value, setValue] = useState('')
  return <Input {...args} onChange={(e) => setValue(e.target.value)} value={value} />
}

const TemplateWithUncontrolledInput: Story<TextFieldProps> = (args) => {
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
