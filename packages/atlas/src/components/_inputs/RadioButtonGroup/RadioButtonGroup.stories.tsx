import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { RadioButtonGroup, RadioButtonGroupProps } from './RadioButtonGroup'

export default {
  title: 'inputs/RadioButtonGroup',
  component: RadioButtonGroup,
  argTypes: {
    selectedValue: { table: { disable: true } },
    options: { table: { disable: true } },
    onChange: { table: { disable: true } },
    value: { table: { disable: true } },
    name: { table: { disable: true } },
  },
  args: {
    label: 'Hello there',
    caption: 't100',
    disabled: false,
    error: false,
  },
} as Meta<RadioButtonGroupProps>

const Template: StoryFn = (args) => {
  const [selected, setSelected] = useState<string | number | boolean>('1')

  const ITEMS = [
    {
      label: args.label,
      caption: args.caption,
      value: '1',
    },
    {
      label: args.label,
      caption: args.caption,
      value: '2',
    },
    {
      label: args.label,
      caption: args.caption,
      value: '3',
    },
  ]

  return (
    <RadioButtonGroup
      {...args}
      name="radio-group"
      options={ITEMS}
      onChange={(e) => setSelected(e.currentTarget.value)}
      value={selected}
    />
  )
}

export const Default = Template.bind({})
