import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ChannelCardBase, ChannelCardBaseProps } from './ChannelCardBase'

export default {
  title: 'Shared/C/ChannelCard',
  component: ChannelCardBase,
  args: {
    avatarUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg',
    title: 'Example Channel',
    id: '3',
    rankingNumber: 4,
    follows: 200,
  },
  argTypes: {
    variant: {
      control: { type: 'select', options: ['primary', 'secondary'] },
      defaultValue: 'primary',
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta

const Template: Story<ChannelCardBaseProps> = (args) => {
  return (
    <>
      <ChannelCardBase {...args} />
    </>
  )
}

export const Default = Template.bind({})
