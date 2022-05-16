import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { Text } from '@/components/Text'
import { TextField } from '@/components/_inputs/TextField'

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

const Template: Story<EmojiWrapperProps> = () => {
  const [text, setText] = useState('I 🤡 love 😍 emojis 🐥')

  return (
    <div>
      <TextField label="Input:" value={text} onChange={(e) => setText(e.target.value)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <Text variant="h500">Twemojis</Text>
          <EmojiWrapper>
            <Text variant="h300">{text}</Text>
          </EmojiWrapper>
        </div>
        <div>
          <Text variant="h500">Default emojis</Text>
          <Text variant="h300">{text}</Text>
        </div>
      </div>
    </div>
  )
}
export const Default = Template.bind({})
