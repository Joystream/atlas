import React from 'react'
import TextField, { TextFieldProps } from '.'
import { Meta, Story } from '@storybook/react'
import { useState, useRef } from '@storybook/addons'
import Button from '../Button'
import { css } from '@emotion/react'

export default {
  title: 'Shared/TextField',
  component: TextField,
  args: {
    label: 'label text',
  },
  argTypes: {
    value: { table: { disable: true } },
  },
} as Meta

const Template: Story<TextFieldProps> = (args) => (
  <TextField
    {...args}
    css={css`
      max-width: 400px;
    `}
  />
)

const TemplateWithControlledInput: Story<TextFieldProps> = (args) => {
  const [value, setValue] = useState('')
  return (
    <TextField
      {...args}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      css={css`
        max-width: 400px;
      `}
    />
  )
}

const TemplateWithUncontrolledInput: Story<TextFieldProps> = (args) => {
  const ref = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <TextField
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
