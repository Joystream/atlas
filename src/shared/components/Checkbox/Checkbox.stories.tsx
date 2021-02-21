import React, { useState } from 'react'

import { WithValue } from '../../../../.storybook/WithValue'
import { Meta, Story } from '@storybook/react'
import Checkbox, { CheckboxProps } from './Checkbox'

export default {
  title: 'Shared/Checkbox',
  component: Checkbox,
  argTypes: {
    value: { table: { disable: true } },
    indeterminate: { table: { disable: true } },
    disabled: { table: { disable: true } },
    error: { table: { disable: true } },
    multiple: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onBlur: { table: { disable: true } },
  },
} as Meta

const SingleTemplate: Story<CheckboxProps> = (args) => {
  const [value, setvalue] = useState(false)

  return (
    <WithValue initial={true} actionName="onChange">
      {(_value, setValue) => <Checkbox {...args} value={value} onChange={setvalue}></Checkbox>}
    </WithValue>
  )
}
const Template: Story<CheckboxProps> = (args) => (
  <>
    <WithValue initial={false} actionName="onChange">
      {(value, setValue) => <Checkbox {...args} value={value} onChange={setValue}></Checkbox>}
    </WithValue>
    <WithValue initial={true} actionName="onChange">
      {(value, setValue) => <Checkbox {...args} value={value} onChange={setValue}></Checkbox>}
    </WithValue>
    <WithValue initial={true} actionName="onChange">
      {(value, setValue) => <Checkbox {...args} value={value} onChange={setValue} indeterminate></Checkbox>}
    </WithValue>
  </>
)

export const Single = SingleTemplate.bind({})
Single.argTypes = {
  indeterminate: { table: { disable: false } },
  disabled: { table: { disable: false } },
  error: { table: { disable: false } },
}

export const Regular = Template.bind({})

export const Error = Template.bind({})
Error.args = {
  error: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
}
