import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'

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
      <FormField label="Input">
        <Input value={text} onChange={(e) => setText(e.target.value)} />
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <Text as="p" variant="h500">
            Twemojis
          </Text>
          <EmojiWrapper>
            <Text as="p" variant="h300">
              {text}
            </Text>
          </EmojiWrapper>
        </div>
        <div>
          <Text as="p" variant="h500">
            Default emojis
          </Text>
          <Text as="p" variant="h300">
            {text}
          </Text>
        </div>
      </div>
    </div>
  )
}
export const Default = Template.bind({})
