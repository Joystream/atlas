import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { CommentInput, CommentInputProps } from './CommentInput'

export default {
  title: 'comments/CommentInput',
  component: CommentInput,
  argTypes: {
    onComment: { table: { disable: true } },
    onCancel: { table: { disable: true } },
    className: { table: { disable: true } },
    fee: { type: 'number' },
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

const Template: StoryFn<CommentInputProps & { cancelButton: boolean }> = (args) => (
  <Container>
    <CommentInput {...args} onCancel={args.cancelButton ? () => ({}) : undefined} />
  </Container>
)

export const Default = Template.bind({})

const Container = styled.div`
  max-width: 800px;
`
