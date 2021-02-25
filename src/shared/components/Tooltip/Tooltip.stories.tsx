import React from 'react'
import Tooltip, { TooltipProps } from './Tooltip'
import { Text, Button, ChannelPreviewBase } from '@/shared/components'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/Tooltip',
  component: Tooltip,
  argTypes: {
    text: { defaultValue: 'Lorem ipsum dolor sit amet!' },
    arrowDisabled: { defaultValue: false },
    darkenContent: { defaultValue: true },
    right: { defaultValue: false },
    above: { defaultValue: false },
  },
} as Meta

const TextTooltip: Story<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <Text>Hello there!</Text>
  </Tooltip>
)

export const WithText = TextTooltip.bind({})

const HeadingTooltip: Story<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <Text variant="h1">Hello there!</Text>
  </Tooltip>
)

export const WithHeading = HeadingTooltip.bind({})

const ChannelPreviewTooltip: Story<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <ChannelPreviewBase
      handle="Lorem"
      avatarUrl="https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg"
    />
  </Tooltip>
)

export const WithChannelPreview = ChannelPreviewTooltip.bind({})

const ButtonTooltip: Story<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <Button>Hover me!</Button>
  </Tooltip>
)

export const WithButton = ButtonTooltip.bind({})
