import { Meta, Story } from '@storybook/react'
import React from 'react'
import StudioCard, { StudioCardProps } from './StudioCard'

export default {
  title: 'Shared/StudioCard',
  component: StudioCard,
  argTypes: {
    avatarPhotoUrl: {
      defaultValue: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg',
    },
  },
} as Meta

const Template: Story<StudioCardProps> = (args) => <StudioCard {...args} />

export const Default = Template.bind({})
