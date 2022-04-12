import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'

import { Tooltip, TooltipProps } from './Tooltip'

export default {
  title: 'other/Tooltip',
  component: Tooltip,
  argTypes: {
    text: { defaultValue: 'Lorem ipsum dolor amet! Lorem ipsum dolor amet!' },
    headerText: { defaultValue: 'Lorem ipsum' },
    placement: {
      control: { type: 'select', options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'] },
      defaultValue: 'bottom-start',
    },
    icon: { defaultValue: false },
    offsetX: { defaultValue: 0 },
    offsetY: { defaultValue: 0 },
    className: { table: { disable: true } },
    reference: { table: { disable: true } },
    arrowDisabled: { table: { disable: true } },
    footer: { control: { type: 'boolean' } },
  },
  args: {
    footer: false,
  },
} as Meta

const TextTooltip: Story<TooltipProps> = (args) => (
  <Tooltip
    {...args}
    footer={
      args.footer && (
        <div key={0} style={{ marginTop: '12px' }}>
          Footer content
        </div>
      )
    }
  >
    <Text variant="t200">Hello there!</Text>
  </Tooltip>
)

export const WithText = TextTooltip.bind({})

const HeadingTooltip: Story<TooltipProps> = (args) => (
  <Tooltip
    {...args}
    footer={
      args.footer && (
        <div key={0} style={{ marginTop: '12px' }}>
          Footer content
        </div>
      )
    }
  >
    <Text variant="h800">Hello there!</Text>
  </Tooltip>
)

export const WithHeading = HeadingTooltip.bind({})

const ButtonTooltip: Story<TooltipProps> = (args) => (
  <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Tooltip
      {...args}
      footer={
        args.footer && (
          <div key={0} style={{ marginTop: '12px' }}>
            Footer content
          </div>
        )
      }
    >
      <Button>Hover me!</Button>
    </Tooltip>
  </div>
)

export const WithButton = ButtonTooltip.bind({})
