import { Meta, StoryObj } from '@storybook/react'

import { RatioSlider as RatioSlider_ } from './RatioSlider'

export default {
  title: 'inputs/Slider/RatioSlider',
  component: RatioSlider_,
  args: {
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 50,
  },
  argTypes: {
    value: { table: { disable: true } },
  },
} as Meta

type Args = {
  min: number
  max: number
  step?: number
  disabled?: boolean
}

export const RatioSlider: StoryObj<Args> = {}
