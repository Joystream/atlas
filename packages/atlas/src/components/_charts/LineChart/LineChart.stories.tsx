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
        'x': 'plane',
        'y': 159,
      },
      {
        'x': 'helicopter',
        'y': 251,
      },
      {
        'x': 'boat',
        'y': 106,
      },
      {
        'x': 'train',
        'y': 139,
      },
      {
        'x': 'subway',
        'y': 297,
      },
      {
        'x': 'bus',
        'y': 253,
      },
      {
        'x': 'car',
        'y': 2,
      },
    ],
  },
]

Default.args = {
  data,
}
