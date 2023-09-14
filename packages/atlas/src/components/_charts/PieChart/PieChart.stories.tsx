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

export const Default = Template.bind({})

const data = [
  {
    id: 'japan',
    value: 40,
  },
  {
    id: 'korea',
    color: 'red',
    value: 60,
  },
]

Default.args = {
  data,
}
