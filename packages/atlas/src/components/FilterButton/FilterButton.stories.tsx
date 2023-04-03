import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { SvgActionShoppingCart } from '@/assets/icons'

import { FilterButton, FilterButtonProps } from './FilterButton'

import { CheckboxProps } from '../_inputs/Checkbox'
import { RadioButtonProps } from '../_inputs/RadioButton'

export default {
  title: 'inputs/FilterButton',
  component: FilterButton,
  args: {
    options: [
      {
        label: 'Small',
        id: 'small',
        value: 'small',
      },
      {
        label: 'Medium',
        id: 'medium',
        value: 'medium',
      },
    ],
    label: 'Label',
    icon: <SvgActionShoppingCart />,
  },
} as Meta<FilterButtonProps>

const CheckboxTemplate: StoryFn<FilterButtonProps> = (args: Extract<FilterButtonProps, { type: 'checkbox' }>) => {
  const [selectedOptions, setSelectedOptions] = useState<CheckboxProps[]>([])

  return <FilterButton {...args} type="checkbox" selectedOptions={selectedOptions} onApply={setSelectedOptions} />
}

export const Checkbox = CheckboxTemplate.bind({})

const RadioTemplate: StoryFn<FilterButtonProps> = (args: Extract<FilterButtonProps, { type: 'radio' }>) => {
  const [selectedOption, setSelectedOption] = useState<RadioButtonProps | null>(null)

  return <FilterButton {...args} type="radio" selectedOption={selectedOption} onApply={setSelectedOption} />
}

export const Radio = RadioTemplate.bind({})
