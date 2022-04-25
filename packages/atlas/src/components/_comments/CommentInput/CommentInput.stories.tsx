import { Meta, Story } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { CommentInput, CommentInputProps } from './CommentInput'

export default {
  title: 'comments/CommentInput',
  component: CommentInput,
  args: {
    cancelButton: false,
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {},
} as Meta<CommentInputProps>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: Story<CommentInputProps & any> = (args) => (
  <CommentInput {...args} onCancel={args.cancelButton ? () => ({}) : undefined} />
)

export const Default = Template.bind({})
