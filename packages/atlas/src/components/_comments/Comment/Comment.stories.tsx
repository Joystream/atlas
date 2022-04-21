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
  },
} as Meta<CommentProps>

const Template: Story<CommentProps> = (args) => <Comment {...args} />

export const Default = Template.bind({})
