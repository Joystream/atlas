import { Story } from '@storybook/react'
import React from 'react'

import { Button } from '@/shared/components/Button'
import { SvgGlyphUpload } from '@/shared/icons'

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
