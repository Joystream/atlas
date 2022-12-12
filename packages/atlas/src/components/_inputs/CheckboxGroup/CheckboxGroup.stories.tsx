import { Meta, StoryFn } from '@storybook/react'
import { ChangeEvent, useState } from 'react'

import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup'

export default {
  title: 'inputs/CheckboxGroup',
  component: CheckboxGroup,
  argTypes: {
    className: { table: { disable: true } },
    selectedValue: { table: { disable: true } },
    options: { table: { disable: true } },
    checkedIds: { table: { disable: true } },
    onChange: { table: { disable: true } },
    name: { table: { disable: true } },
  },
  args: {
    label: 'Hello there',
    caption: 't100',
    disabled: false,
    error: false,
  },
} as Meta<CheckboxGroupProps>

const Template: StoryFn = (args) => {
  const [selected, setSelected] = useState<number[]>([])
  const handleChange: (id: number, e?: ChangeEvent<HTMLInputElement>) => void = (id) => {
    setSelected((prevState) => {
      if (selected.includes(id)) {
        return prevState.filter((state) => state !== id)
      }
      return [...prevState, id]
    })
  }

  const ITEMS = [
    {
      label: args.label,
      caption: args.caption,
    },
    {
      label: args.label,
      caption: args.caption,
    },
    {
      label: args.label,
      caption: args.caption,
    },
  ]

  return <CheckboxGroup {...args} name="radio-group" options={ITEMS} onChange={handleChange} checkedIds={selected} />
}

export const Default = Template.bind({})
