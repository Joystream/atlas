import { css } from '@emotion/react'
import { Meta, Story } from '@storybook/react'
import React, { useRef, useState } from 'react'

import { TextArea, TextAreaProps } from './TextArea'

import { Button } from '../Button'

export default {
  title: 'Shared/T/TextArea',
  component: TextArea,
  argTypes: {
    value: { table: { disable: true } },
    label: {
      defaultValue: 'Some label',
    },
    placeholder: {
      defaultValue: 'Some placeholder',
    },
  },
} as Meta

const Template: Story<TextAreaProps> = (args) => (
  <TextArea
    {...args}
    css={css`
      max-width: 400px;
    `}
  />
)

const TemplateWithControlledInput: Story<TextAreaProps> = (args) => {
  const [value, setValue] = useState('')
  return (
    <TextArea
      {...args}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      css={css`
        max-width: 400px;
      `}
    />
  )
}

const TemplateWithUncontrolledInput: Story<TextAreaProps> = (args) => {
  const ref = useRef<HTMLTextAreaElement | null>(null)
  return (
    <>
      <TextArea
        {...args}
        ref={ref}
        css={css`
          max-width: 400px;
        `}
      />
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
