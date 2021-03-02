import { OverlayManagerProvider } from '@/hooks'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import MultiFileSelect from './MultiFileSelect'

export default {
  title: 'Shared/MultiFileSelect',
  component: MultiFileSelect,
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const Template: Story = (args) => <MultiFileSelect {...args} />

export const Default = Template.bind({})
