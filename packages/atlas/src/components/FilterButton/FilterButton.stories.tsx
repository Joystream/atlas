import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { SvgActionShoppingCart } from '@/assets/icons'

import { FilterButton, FilterButtonOption, FilterButtonProps, isFilterRange } from './FilterButton'

export default {
  title: 'inputs/FilterButton',
  component: FilterButton,
  args: {
    options: [
      {
        label: 'Small',
        selected: false,
        applied: false,
        value: 'small',
      },
      {
        label: 'Medium',
        selected: false,
        applied: false,
        value: 'medium',
      },
    ],
    label: 'Label',
    icon: <SvgActionShoppingCart />,
  },
} as Meta<FilterButtonProps>

const CheckboxTemplate: StoryFn<FilterButtonProps> = (args) => {
  const [options, setOptions] = useState<FilterButtonOption[]>(args.options || [])

  return (
    <FilterButton
      {...args}
      type="checkbox"
      options={options}
      onChange={(val) => !isFilterRange(val) && setOptions(val)}
    />
  )
}

export const Checkbox = CheckboxTemplate.bind({})

const RadioTemplate: StoryFn<FilterButtonProps> = (args) => {
  const [options, setOptions] = useState<FilterButtonOption[]>(args.options || [])

  return (
    <FilterButton {...args} type="radio" options={options} onChange={(val) => !isFilterRange(val) && setOptions(val)} />
  )
}

export const Radio = RadioTemplate.bind({})
