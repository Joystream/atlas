import { Meta, Story } from '@storybook/react'

import { WithValue } from '@/components/../../.storybook/WithValue'

import { Checkbox, CheckboxProps } from './Checkbox'

export default {
  title: 'inputs/Checkbox',
  component: Checkbox,
  argTypes: {
    label: {
      defaultValue: 'Checkbox label',
    },
    value: { table: { disable: true } },
    name: { table: { disable: true } },
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

const SingleTemplate: Story<CheckboxProps> = (args) => (
  <WithValue initial={true} actionName="onChange">
    {(value, setValue) => <Checkbox {...args} value={value} onChange={setValue} />}
  </WithValue>
)

const Template: Story<CheckboxProps> = (args) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridGap: '12px' }}>
    <WithValue initial={false} actionName="onChange">
      {(value, setValue) => <Checkbox {...args} value={value} onChange={setValue} />}
    </WithValue>
    <WithValue initial={true} actionName="onChange">
      {(value, setValue) => <Checkbox {...args} value={value} onChange={setValue} />}
    </WithValue>
    <WithValue initial={true} actionName="onChange">
      {(value, setValue) => <Checkbox {...args} value={value} onChange={setValue} indeterminate />}
    </WithValue>
  </div>
)

export const Single = SingleTemplate.bind({})
Single.argTypes = {
  indeterminate: { table: { disable: false } },
  disabled: { table: { disable: false } },
  error: { table: { disable: false } },
  helperText: {
    defaultValue: 'With helper text',
  },
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
