import React from 'react'
import Tooltip, { TooltipProps } from './Tooltip'
import { Text, Button, ChannelPreviewBase } from '@/shared/components'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/Tooltip',
  component: Tooltip,
  argTypes: {
    text: { defaultValue: 'Lorem ipsum dolor sit amet! Lorem ipsum dolor sit amet! Lorem ipsum dolor sit amet!' },
    headerText: { defaultValue: 'Lorem ipsum' },
    arrowDisabled: { defaultValue: false },
    placement: {
      control: { type: 'select', options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'] },
      defaultValue: 'bottom-start',
    },
    icon: { defaultValue: false },
    offsetX: { defaultValue: 0 },
    offsetY: { defaultValue: 0 },
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
  <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Tooltip {...args}>
      <ChannelPreviewBase
        title="Lorem"
        avatarUrl="https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg"
        loading={false}
      />
    </Tooltip>
  </div>
)

export const WithChannelPreview = ChannelPreviewTooltip.bind({})

const ButtonTooltip: Story<TooltipProps> = (args) => (
  <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Tooltip {...args}>
      <Button>Hover me!</Button>
    </Tooltip>
  </div>
)

export const WithButton = ButtonTooltip.bind({})
