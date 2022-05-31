import { Meta, Story } from '@storybook/react'
import React from 'react'

import { NumberFormat, NumberFormatProps } from './NumberFormat'

export default {
  title: 'other/NumberFormat',
  component: NumberFormat,
  args: {
    value: 100000.123456789,
    format: 'dollar',
    withToken: false,
    withTooltip: true,
    variant: 't100-strong',
  },
} as Meta<NumberFormatProps>

const Template: Story<Omit<NumberFormatProps, 'ref'>> = ({ variant = 't100-strong', ...args }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', padding: '200px' }}>
    <NumberFormat {...args} variant={variant} />
  </div>
)

export const Regular = Template.bind({})
