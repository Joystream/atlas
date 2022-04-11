import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'

import { CommentRow, CommentRowProps } from './CommentRow'

export default {
  title: 'loaders/CommentRow',
  component: CommentRow,
  args: {
    memberAvatarUrl: 'https://placedog.net/100/100?random=2',
  },
  argTypes: {
    memberUrl: {
      table: { disable: true },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta<CommentRowProps>

const Template: Story<CommentRowProps> = (args) => (
  <CommentRow {...args}>
    {/* children */}
    <div
      style={{
        background: cVar('colorBackgroundPrimaryMuted'),
      }}
    >
      <Text variant="h200">Please ignore styling of this blue box. It's for testing purposes only</Text>
      <Text variant="t200">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur aut, ipsam sit impedit voluptatem ad libero
        necessitatibus porro dignissimos voluptatum quis debitis tempora omnis, provident repellat iure accusantium,
        blanditiis voluptate!{' '}
      </Text>
    </div>
  </CommentRow>
)

export const Default = Template.bind({})
