import { Meta, Story } from '@storybook/react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'

import { Tooltip, TooltipProps } from './Tooltip'

export default {
  title: 'other/Tooltip',
  component: Tooltip,
  argTypes: {
    placement: {
      control: { type: 'select', options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'] },
    },
    icon: { defaultValue: false },
    className: { table: { disable: true } },
    reference: { table: { disable: true } },
    hideOnClick: { table: { disable: true } },
    delay: { table: { disable: true } },
    showOnCreate: { table: { disable: true } },
    customContent: { type: 'boolean' },
  },
  args: {
    customContent: false,
    icon: false,
    offsetX: 0,
    offsetY: 0,
    placement: 'bottom-start',
    text: 'Lorem ipsum dolor amet! Lorem ipsum dolor amet!',
    headerText: 'Lorem ipsum',
  },
} as Meta<TooltipProps>

const DefaultTooltip: Story<TooltipProps> = (args) => (
  <Tooltip
    {...args}
    showOnCreate
    customContent={
      args.customContent && <div style={{ border: '1px solid red' }}>Custom content which is quite long</div>
    }
  />
)

export const Default = DefaultTooltip.bind({})

const TextTooltip: Story<TooltipProps> = (args) => (
  <Tooltip
    {...args}
    customContent={
      args.customContent && (
        <div key={0} style={{ marginTop: '12px' }}>
          Footer content
        </div>
      )
    }
  >
    <Text as="span" variant="t200">
      Hello there!
    </Text>
  </Tooltip>
)

export const WithText = TextTooltip.bind({})

const HeadingTooltip: Story<TooltipProps> = (args) => (
  <Tooltip
    {...args}
    customContent={
      args.customContent && (
        <div key={0} style={{ marginTop: '12px' }}>
          Footer content
        </div>
      )
    }
  >
    <Text as="h1" variant="h800">
      Hello there!
    </Text>
  </Tooltip>
)

export const WithHeading = HeadingTooltip.bind({})

const ButtonTooltip: Story<TooltipProps> = (args) => (
  <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Tooltip
      {...args}
      customContent={
        args.customContent && (
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
