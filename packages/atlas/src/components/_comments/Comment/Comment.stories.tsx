import { Meta, StoryFn } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { InternalComment, InternalCommentProps } from './InternalComment'

export default {
  title: 'comments/Comment',
  component: InternalComment,
  args: {
    memberAvatarUrl: 'https://placedog.net/100/100?random=2',
    memberHandle: 'johndoe',
    loading: false,
    type: 'default',
    createdAt: new Date(1649761429792),
    reactions: [
      { count: 320, reactionId: 1, reactionPopoverDismissed: false },
      { count: 500, reactionId: 2, active: true },
      { count: 100, reactionId: 3 },
    ],
    text: 'Next level 📈 video 🎬 I love it 🥰',
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
} as Meta<InternalCommentProps>

const Template: StoryFn<InternalCommentProps> = (args) => <InternalComment {...args} />

export const Default = Template.bind({})
export const NoReactions = Template.bind({})
NoReactions.args = {
  reactions: [],
}
export const ProcessingReaction = Template.bind({})
ProcessingReaction.args = {
  reactions: [
    { count: 320, reactionId: 1 },
    { count: 500, reactionId: 2, active: true, state: 'processing' },
    { count: 100, reactionId: 3 },
  ],
}
export const AllReactionsApplied = Template.bind({})
AllReactionsApplied.args = {
  reactions: [
    { count: 320, reactionId: 1 },
    { count: 500, reactionId: 2 },
    { count: 100, reactionId: 3 },
    { count: 100, reactionId: 4 },
    { count: 100, reactionId: 5, active: true },
  ],
}
