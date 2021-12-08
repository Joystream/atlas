import { useRef, useState } from '@storybook/addons'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionCancel } from '@/components/_icons'

import { TextField, TextFieldProps } from '.'

export default {
  title: 'inputs/TextField',
  component: TextField,
  args: {
    label: 'label text',
    placeholder: 'placeholder text',
  },
  argTypes: {
    value: { table: { disable: true } },
  },
} as Meta

const Template: Story<TextFieldProps> = (args) => <TextField {...args} />

const TemplateWithControlledInput: Story<TextFieldProps> = (args) => {
  const [value, setValue] = useState('')
  return <TextField {...args} onChange={(e) => setValue(e.target.value)} value={value} />
}

const TemplateWithUncontrolledInput: Story<TextFieldProps> = (args) => {
  const ref = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <TextField {...args} ref={ref} />
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
