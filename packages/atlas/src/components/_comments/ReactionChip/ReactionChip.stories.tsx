import { Meta, Story } from '@storybook/react'

import { ReactionChip, ReactionChipProps } from './ReactionChip'

export default {
  title: 'comments/ReactionChip',
  args: {
    active: true,
    type: 'love',
    state: 'default',
  },
  component: ReactionChip,
} as Meta<ReactionChipProps>

const Template: Story<ReactionChipProps> = (args) => <ReactionChip {...args} />

export const Default = Template.bind({})
