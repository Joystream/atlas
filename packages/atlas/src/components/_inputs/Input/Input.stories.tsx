import { useRef } from '@storybook/addons'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionCancel, SvgActionClose } from '@/components/_icons'

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
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onKeyDown: { table: { disable: true } },
    onWheel: { table: { disable: true } },
    autoComplete: { table: { disable: true } },
    nodeEnd: { table: { disable: true } },
    nodeStart: { table: { disable: true } },
    className: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
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
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => alert(ref.current?.value)}>Show input value</Button>
      </div>
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
  nodeEnd: <Button variant="tertiary" size="small" icon={<SvgActionClose />} />,
}
