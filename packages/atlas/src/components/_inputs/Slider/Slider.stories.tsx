import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'

import { WithValue } from '@/components/../../.storybook/WithValue'

import { Slider, SliderProps } from '.'

export default {
  title: 'inputs/Slider',
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
    {(value, setValue) => <StyledSlider {...args} value={value} onChange={setValue} />}
  </WithValue>
)

export const Default = Template.bind({})

const StyledSlider = styled(Slider)`
  max-width: 300px;
`
