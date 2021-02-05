import React from 'react'
import Tooltip, { TooltipProps } from './Tooltip'
import { Text, Button } from '@/shared/components'
import { Regular as ChannelPreview } from '../ChannelPreview/ChannelPreview.stories'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/Tooltip',
  component: Tooltip,
  argTypes: {
    text: { control: 'text', defaultValue: 'Lorem ipsum dolor sit amet!' },
    arrowDisabled: { control: 'boolean', defaultValue: false },
  },
} as Meta

const TextTooltip: Story<TooltipProps> = ({ text, arrowDisabled }) => (
  <Tooltip text={text} arrowDisabled={arrowDisabled}>
    <Text>Hello there!</Text>
  </Tooltip>
)

export const WithText = TextTooltip.bind({})

const HeadingTooltip: Story<TooltipProps> = ({ text, arrowDisabled }) => (
  <Tooltip text={text} arrowDisabled={arrowDisabled}>
    <Text variant="h1">Hello there!</Text>
  </Tooltip>
)

export const WithHeading = HeadingTooltip.bind({})

const ChannelPreviewTooltip: Story<TooltipProps> = ({ text, arrowDisabled }) => (
  <Tooltip text={text} arrowDisabled={arrowDisabled}>
    <ChannelPreview name="Lorem" />
  </Tooltip>
)

export const WithChannelPreview = ChannelPreviewTooltip.bind({})

const ButtonTooltip: Story<TooltipProps> = ({ text, arrowDisabled }) => (
  <Tooltip text={text} arrowDisabled={arrowDisabled}>
    <Button>Hover me!</Button>
  </Tooltip>
)

export const WithButton = ButtonTooltip.bind({})
