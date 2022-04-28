import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { CommentSnapshot, CommentSnapshotProps } from './CommentSnaphsot'

export default {
  title: 'comments/CommentSnapshot',
  component: CommentSnapshot,
  args: {
    memberAvatarUrl: 'https://placedog.net/100/100?random=2',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, a suscipit? Quaerat veniam rerum voluptatem quasi similique quo corporis aspernatur excepturi porro vitae expedita, aliquam amet quisquam velit quod in?',
    loading: false,
    memberHandle: 'johndoe',
    createdAt: new Date(1649761429792),
  },
  argTypes: {
    createdAt: { control: 'date' },
    memberUrl: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta<CommentSnapshotProps>

const SingleTemplate: Story<CommentSnapshotProps> = (args) => {
  return <CommentSnapshot {...args} />
}

const ManyTemplate: Story<CommentSnapshotProps> = (args) => {
  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <CommentSnapshot {...args} />
      <CommentSnapshot {...args} />
      <CommentSnapshot {...args} />
      <CommentSnapshot {...args} last={true} />
    </div>
  )
}
export const Single = SingleTemplate.bind({})
export const Many = ManyTemplate.bind({})
