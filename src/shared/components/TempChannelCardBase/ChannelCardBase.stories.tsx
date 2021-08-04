import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { TempChannelCardBase, TempChannelCardBaseProps } from './TempChannelCardBase'

export default {
  title: 'Shared/C/ChannelCardBase',
  component: TempChannelCardBase,
  args: {
    avatarUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg',
    title: 'Example Channel',
    id: '3',
    rankingNumber: 4,
    follows: 200,
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta

const Template: Story<TempChannelCardBaseProps> = (args) => {
  return (
    <>
      <TempChannelCardBase {...args} />
    </>
  )
}

export const Default = Template.bind({})
