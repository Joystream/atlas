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

export const WidthAuto = Template.bind({})
WidthAuto.args = {
  width: 'auto',
}

export const WidthFixed = Template.bind({})
WidthFixed.args = {
  width: 'fixed',
}

export const WidthFixedWithoutOverflow = Template.bind({})
WidthFixedWithoutOverflow.args = {
  width: 'fixed',
  options: ['small', 'large'],
}
