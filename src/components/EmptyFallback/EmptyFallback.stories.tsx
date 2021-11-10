import { Story } from '@storybook/react'
import React from 'react'

import { SvgGlyphUpload } from '@/components/_icons'
import { Button } from '@/components/_inputs/Button'

import { EmptyFallback, EmptyFallbackProps } from './EmptyFallback'

export default {
  title: 'other/EmptyFallback',
  argTypes: {
    title: {
      control: { type: 'text' },
      defaultValue: 'No draft here yet',
    },
    subtitle: {
      control: { type: 'text' },
      defaultValue: 'Each unfinished project will be saved here as a draft. Start publishing to see something here.',
    },
    variant: {
      control: { type: 'select', options: ['small', 'large'] },
      defaultValue: 'large',
    },
  },
}

const Template: Story<EmptyFallbackProps> = (args) => (
  <EmptyFallback
    {...args}
    button={
      <Button icon={<SvgGlyphUpload />} variant="secondary" size="large">
        Upload video
      </Button>
    }
  />
)

export const Default = Template.bind({})
