import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { SvgActionShoppingCart } from '@/assets/icons'

import { FilterButton, FilterButtonProps } from './FilterButton'

import { CheckboxProps } from '../_inputs/Checkbox'

export default {
  title: 'inputs/FilterButton',
  component: FilterButton,
  args: {
    options: [
      {
        label: 'Small',
        id: 'small',
      },
      {
        label: 'Medium',
        id: 'medium',
      },
    ],
    label: 'Label',
    icon: <SvgActionShoppingCart />,
  },
} as Meta<FilterButtonProps>

const Template: StoryFn<FilterButtonProps> = (args) => {
  const [selectedOptions, setSelectedOptions] = useState<CheckboxProps[]>([])

  return <FilterButton {...args} selectedOptions={selectedOptions} onApply={setSelectedOptions} />
}

export const Default = Template.bind({})
