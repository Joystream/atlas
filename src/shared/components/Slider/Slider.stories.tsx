import React from 'react'
import Slider, { SliderProps } from '.'
import { Story, Meta } from '@storybook/react'
import { WithValue } from '../../../../.storybook/WithValue'

export default {
  title: 'Shared/Slider',
  component: Slider,
  args: {
    min: 0,
    max: 100,
  },
  argTypes: {
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
} as Meta

const Template: Story<SliderProps> = (args) => (
  <WithValue initial={50} actionName="onChange">
    {(value, setValue) => <Slider style={{ maxWidth: '200px' }} {...args} value={value} onChange={setValue} />}
  </WithValue>
)

export const Default = Template.bind({})
