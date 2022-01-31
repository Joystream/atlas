import { Meta, Story } from '@storybook/react'
import React from 'react'

import { OwnerPill, OwnerPillProps } from '.'

export default {
  title: 'Other/OwnerPill',
  component: OwnerPill,
  args: {
    handle: 'verylonghandle',
    avatar: 'https://thispersondoesnotexist.com/image',
  },
} as Meta

const Template: Story<OwnerPillProps> = (args) => (
  <div style={{ maxWidth: '180px' }}>
    <OwnerPill {...args} />
  </div>
)

export const Default = Template.bind({})
