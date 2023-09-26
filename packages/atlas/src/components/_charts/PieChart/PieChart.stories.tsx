import { Meta, StoryFn } from '@storybook/react'

import { PieChart, PieChartProps } from './PieChart'

export default {
  title: 'charts/PieChart',
  component: PieChart,
} as Meta<PieChartProps>

const Template: StoryFn<PieChartProps> = (args) => (
  <div style={{ height: 400 }}>
    <PieChart {...args} />
  </div>
)

const data = [
  {
    index: 0,
    id: 'japan',
    value: 40,
  },
  {
    index: 1,
    id: 'korea',
    value: 60,
  },
]

export const Default = Template.bind({})
Default.args = {
  data,
}
