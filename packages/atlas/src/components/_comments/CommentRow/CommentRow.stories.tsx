import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Comment, CommentProps } from '../Comment'

export default {
  title: 'comments/Comment',
  component: Comment,
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
} as Meta<CommentProps>

const Template: Story<CommentProps> = (args) => <Comment {...args} />

export const Default = Template.bind({})
