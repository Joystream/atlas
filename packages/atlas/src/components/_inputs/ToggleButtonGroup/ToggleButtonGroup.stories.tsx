import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { ToggleButtonGroup, ToggleButtonGroupProps } from './ToggleButtonGroup'

type SbOptions = 'small' | 'medium' | 'large'

export default {
  title: 'inputs/ToggleButtonGroup',
  component: ToggleButtonGroup,
  args: {
    type: 'options',
    options: ['small', 'large', 'medium', 'medium3', 'medium2'],
  },
} as Meta<ToggleButtonGroupProps<SbOptions>>

const OptionsTemplate: StoryFn<ToggleButtonGroupProps> = (args: ToggleButtonGroupProps<SbOptions>) => {
  const [value, setValue] = useState<SbOptions>('large')

  return (
    <ToggleButtonGroup<SbOptions>
      {...args}
      options={args.type === 'options' ? args.options : []}
      type="options"
      value={value}
      onChange={(value: SbOptions) => setValue(value)}
    />
  )
}

export const WidthAuto = OptionsTemplate.bind({})
WidthAuto.args = {
  width: 'auto',
}

export const WidthFixed = OptionsTemplate.bind({})
WidthFixed.args = {
  width: 'fixed',
}

export const WidthFixedWithoutOverflow = OptionsTemplate.bind({})
WidthFixedWithoutOverflow.args = {
  width: 'fixed',
}
