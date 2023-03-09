import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { SvgActionShoppingCart } from '@/assets/icons'

import { FilterButton, FilterButtonProps } from './FilterButton'

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
  const [value, setValue] = useState<number[]>([])
  return <FilterButton {...args} selected={value} onApply={setValue} />
}

export const Default = Template.bind({})
