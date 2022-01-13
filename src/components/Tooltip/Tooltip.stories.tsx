import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ChannelCard } from '@/components/_channel/ChannelCard'

import { Tooltip, TooltipProps } from './Tooltip'

export default {
  title: 'other/Tooltip',
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
    <Text variant="t200">Hello there!</Text>
  </Tooltip>
)

export const WithText = TextTooltip.bind({})

const HeadingTooltip: Story<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <Text variant="h800">Hello there!</Text>
  </Tooltip>
)

export const WithHeading = HeadingTooltip.bind({})

const ButtonTooltip: Story<TooltipProps> = (args) => (
  <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Tooltip {...args}>
      <Button>Hover me!</Button>
    </Tooltip>
  </div>
)

export const WithButton = ButtonTooltip.bind({})
