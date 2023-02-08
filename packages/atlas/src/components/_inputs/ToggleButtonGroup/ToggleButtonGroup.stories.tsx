import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { ToggleButtonGroup, ToggleButtonGroupProps } from './ToggleButtonGroup'

type SbOptions = 'small' | 'medium' | 'large'

export default {
  title: 'inputs/ToggleButtonGroup',
  component: ToggleButtonGroup,
  args: {
    options: ['small', 'large', 'medium', 'medium3', 'medium2'],
  },
} as Meta<ToggleButtonGroupProps<SbOptions>>

const Template: StoryFn<ToggleButtonGroupProps<SbOptions>> = (args) => {
  const [value, setValue] = useState<SbOptions>('large')

  return <ToggleButtonGroup {...args} value={value} onChange={setValue} />
}

export const Default = Template.bind({})
