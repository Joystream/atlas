import { Meta, Story } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { Comment, CommentProps } from './Comment'

export default {
  title: 'comments/Comment',
  component: Comment,
  args: {
    memberAvatarUrl: 'https://placedog.net/100/100?random=2',
    memberHandle: 'johndoe',
    loading: false,
    type: 'default',
    createdAt: new Date(1649761429792),
    reactions: [
      { count: 320, type: 'amusment' },
      { count: 500, type: 'love', active: true },
      { count: 100, type: 'shock' },
    ],
    comment:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, facere molestias, iusto unde harum ducimus reprehenderit iste, magnam delectus aperiam impedit eligendi iure autem repellendus dolorum culpa sed cupiditate illum.',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    createdAt: { control: 'date' },
    onDeleteClick: { table: { disable: true } },
    onEditClick: { table: { disable: true } },
    onEditLabelClick: { table: { disable: true } },
    onReactionClick: { table: { disable: true } },
    reactions: { table: { disable: true } },
  },
} as Meta<CommentProps>

const Template: Story<CommentProps> = (args) => <Comment {...args} />

export const Default = Template.bind({})
export const NoReactions = Template.bind({})
NoReactions.args = {
  reactions: [],
}
export const ProcessingReaction = Template.bind({})
ProcessingReaction.args = {
  reactions: [
    { count: 320, type: 'amusment' },
    { count: 500, type: 'love', active: true, state: 'processing' },
    { count: 100, type: 'shock' },
  ],
}
export const AllReactionsApplied = Template.bind({})
AllReactionsApplied.args = {
  reactions: [
    { count: 320, type: 'amusment' },
    { count: 500, type: 'love' },
    { count: 100, type: 'laugh' },
    { count: 100, type: 'shock' },
    { count: 100, type: 'anger', active: true },
  ],
}
