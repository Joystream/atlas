import { Meta, Story } from '@storybook/react'

import { SvgActionUpload } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'

import { EmptyFallback, EmptyFallbackProps } from './EmptyFallback'

export default {
  title: 'other/EmptyFallback',
  args: {
    title: 'No draft here yet',
    subtitle: 'Each unfinished project will be saved here as a draft. Start publishing to see something here.',
    variant: 'large',
  },
  argTypes: {
    variant: {
      control: { type: 'select', options: ['small', 'large'] },
    },
    className: {
      table: { disable: true },
    },
  },
} as Meta<EmptyFallbackProps>

const Template: Story<EmptyFallbackProps> = (args) => (
  <EmptyFallback
    {...args}
    button={
      <Button icon={<SvgActionUpload />} variant="secondary" size="large">
        Upload video
      </Button>
    }
  />
)

export const Default = Template.bind({})
