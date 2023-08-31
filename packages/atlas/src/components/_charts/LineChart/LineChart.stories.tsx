import { Meta, StoryFn } from '@storybook/react'

import { LineChart, LineChartProps } from '@/components/_charts/LineChart/LineChart'

export default {
  title: 'charts/LineChart',
  component: LineChart,
} as Meta<LineChartProps>

const Template: StoryFn<LineChartProps> = (args) => (
  <div style={{ height: 400 }}>
    <LineChart {...args} />
  </div>
)

export const Default = Template.bind({})

const data = [
  {
    'id': 'japan',
    'color': 'dodgerblue',
    'data': [
      {
        'x': 'Now',
        'y': 50,
      },
      {
        'x': '2M',
        'y': 50,
      },
      {
        'x': '3M',
        'y': 50,
      },
    ],
  },
  {
    'id': 'korea',
    'color': 'dodgerblue',
    'data': [
      {
        'x': '3M',
        'y': 50,
      },
      {
        'x': '3M',
        'y': 130,
      },
      {
        'x': '6M',
        'y': 160,
      },
      {
        'x': '9M',
        'y': 190,
      },
      {
        'x': '12M',
        'y': 220,
      },
      {
        'x': '15M',
        'y': 250,
      },
    ],
  },
]

Default.args = {
  data,
}
