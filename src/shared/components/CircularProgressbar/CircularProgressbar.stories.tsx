import { Meta, Story } from '@storybook/react'
import React from 'react'

import { CircularProgressbar, CircularProgressbarProps } from './CircularProgressbar'

export default {
  title: 'Shared/C/CircularProgressbar',
  component: CircularProgressbar,
  argTypes: {},
} as Meta

const SingleTemplate: Story<CircularProgressbarProps> = (args) => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <div style={{ width: '24px', height: '24px' }}>
      <CircularProgressbar {...args}></CircularProgressbar>
    </div>
    <div style={{ width: '48px', height: '48px' }}>
      <CircularProgressbar {...args}></CircularProgressbar>
    </div>
    <div style={{ width: '96px', height: '96px' }}>
      <CircularProgressbar {...args}></CircularProgressbar>
    </div>
  </div>
)

export const Single = SingleTemplate.bind({})
Single.args = {
  value: 30,
}
