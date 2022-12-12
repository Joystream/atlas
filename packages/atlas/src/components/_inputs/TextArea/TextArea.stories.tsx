import { Meta, StoryFn } from '@storybook/react'
import { useRef, useState } from 'react'

import { Button } from '@/components/_buttons/Button'

import { TextArea, TextAreaProps } from './TextArea'

export default {
  title: 'inputs/TextArea',
  component: TextArea,
  args: {
    placeholder: 'this is placeholder',
    error: false,
    disabled: false,
    rows: 3,
    size: 'medium',
  },
  argTypes: {
    size: { control: { type: 'select', options: ['medium', 'large'] } },
    value: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    spellcheck: { table: { disable: true } },
  },
} as Meta<TextAreaProps>

const Template: StoryFn<TextAreaProps> = (args) => <TextArea {...args} />

const TemplateWithControlledInput: StoryFn<TextAreaProps> = (args) => {
  const [value, setValue] = useState('')
  return <TextArea {...args} onChange={(e) => setValue(e.target.value)} value={value} />
}

const TemplateWithUncontrolledInput: StoryFn<TextAreaProps> = (args) => {
  const ref = useRef<HTMLTextAreaElement | null>(null)
  return (
    <>
      <TextArea {...args} ref={ref} />
      <Button onClick={() => alert(ref.current?.value)}>Show input value</Button>
    </>
  )
}

export const Default = Template.bind({})
Default.argTypes = {
  value: { table: { disable: false } },
}
export const WithUncontrolledInput = TemplateWithUncontrolledInput.bind({})

export const WithControlledInput = TemplateWithControlledInput.bind({})

export const WithCounter = Template.bind({})
WithCounter.args = {
  counter: true,
  maxLength: 30,
}
