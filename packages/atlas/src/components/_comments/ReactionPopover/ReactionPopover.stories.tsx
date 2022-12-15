import { Meta, StoryFn } from '@storybook/react'

import { Text } from '@/components/Text'

import { ReactionPopover, ReactionPopoverProps } from './ReactionPopover'

export default {
  title: 'comments/ReactionPopover',
  component: ReactionPopover,
  argTypes: {
    onReactionClick: { table: { disable: true } },
  },
} as Meta<ReactionPopoverProps>

const Template: StoryFn<ReactionPopoverProps> = (args) => (
  <div
    style={{
      border: '1px solid silver',
      maxWidth: '250px',
      height: '250px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <ReactionPopover {...args} />
  </div>
)
const EdgeOfTheScreenTemplate: StoryFn<ReactionPopoverProps> = (args) => (
  <div style={{ marginLeft: '-15px' }}>
    <ReactionPopover {...args} />
    <Text as="p" variant="t100" color="colorText">
      Reaction popover should be displayed at the bottom and should never go beyond the boundaries of the viewport.
    </Text>
    <div style={{ marginTop: '80px' }}>
      <ReactionPopover {...args} />
      <Text as="p" variant="t100" color="colorText">
        Reaction popover should be displayed at the top and should never go beyond the boundaries of the viewport.
      </Text>
    </div>
  </div>
)

export const Default = Template.bind({})
export const EdgeOfTheScreen = EdgeOfTheScreenTemplate.bind({})
