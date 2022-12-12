import { Meta, StoryFn } from '@storybook/react'

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
  args: {
    disabled: false,
    error: false,
    indeterminate: false,
  },
} as Meta

const SingleTemplate: StoryFn<CheckboxProps> = (args) => (
  <WithValue initial={true} actionName="onChange">
    {(value, setValue) => <Checkbox {...args} value={value} onChange={setValue} />}
  </WithValue>
)

const Template: StoryFn<CheckboxProps> = (args) => (
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
  caption: {
    defaultValue: 'With caption',
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
