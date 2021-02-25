import { Meta, Story } from '@storybook/react'
import React from 'react'
import MultiFileSelect from './MultiFileSelect'

export default {
  title: 'Shared/MultiFileSelect',
  component: MultiFileSelect,
} as Meta

const Template: Story = (args) => <MultiFileSelect {...args} />

export const Default = Template.bind({})
