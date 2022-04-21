import { Meta, Story } from '@storybook/react'
import React from 'react'

import { ReactionChip, ReactionChipProps } from './ReactionChip'

export default {
  title: 'comments/ReactionChip',
  component: ReactionChip,
} as Meta<ReactionChipProps>

const Template: Story<ReactionChipProps> = (args) => <ReactionChip {...args} />

export const Default = Template.bind({})
