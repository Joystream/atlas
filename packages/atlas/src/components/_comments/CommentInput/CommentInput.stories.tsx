import { Meta, Story } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { CommentInput, CommentInputProps } from './CommentInput'

export default {
  title: 'comments/CommentInput',
  component: CommentInput,
  argTypes: {
    onComment: { table: { disable: true } },
    onCancel: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    cancelButton: false,
    processing: false,
    memberAvatarUrl: 'https://placedog.net/100/100?random=2',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta<CommentInputProps>

const Template: Story<CommentInputProps & { cancelButton: boolean }> = (args) => (
  <CommentInput {...args} onCancel={args.cancelButton ? () => ({}) : undefined} />
)

export const Default = Template.bind({})
