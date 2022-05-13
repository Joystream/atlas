import { Meta, Story } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { Text } from '@/components/Text'
import { Comment } from '@/components/_comments/Comment'

import { EmojiWrapper, EmojiWrapperProps } from './EmojiWrapper'

export default {
  title: 'Other/EmojiWrapper',
  component: EmojiWrapper,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta

const Template: Story<EmojiWrapperProps> = (args) => {
  const content = (
    <>
      <Text variant="h400">I 🤡 love 😍 emojis 🐥</Text>
    </>
  )
  return (
    <div>
      <Text variant="h700">Twemojis</Text>
      <EmojiWrapper {...args}>{content}</EmojiWrapper>
      <Comment
        type="default"
        text="Next level 📈 video 🎬 I love it 🥰"
        memberAvatarUrl="https://placedog.net/100/100?random=2"
        memberHandle="johndoe"
        loading={false}
        createdAt={new Date(1649761429792)}
        reactions={[
          { count: 320, reactionId: 1 },
          { count: 500, reactionId: 2, active: true },
          { count: 100, reactionId: 3 },
        ]}
      />

      <hr style={{ marginTop: 48 }} />
      <Text variant="h700">Default emojis</Text>
      {content}
    </div>
  )
}
export const Default = Template.bind({})
