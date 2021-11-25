import { Meta, Story } from '@storybook/react'
import React from 'react'

import { CircularProgress, CircularProgressProps } from './CircularProgress'

export default {
  title: 'other/CircularProgress',
  component: CircularProgress,
  argTypes: {},
} as Meta

const SingleTemplate: Story<CircularProgressProps> = (args) => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <div style={{ width: '24px', height: '24px' }}>
      <CircularProgress {...args}></CircularProgress>
    </div>
    <div style={{ width: '48px', height: '48px' }}>
      <CircularProgress {...args}></CircularProgress>
    </div>
    <div style={{ width: '96px', height: '96px' }}>
      <CircularProgress {...args}></CircularProgress>
    </div>
  </div>
)

export const Single = SingleTemplate.bind({})
Single.args = {
  value: 30,
}
