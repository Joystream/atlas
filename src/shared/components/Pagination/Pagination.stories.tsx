import { Meta, Story } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import Pagination from './Pagination'

export default {
  title: 'Shared/Pagination',
  component: Pagination,
  argTypes: {
    take: {
      defaultValue: 10,
    },
    totalCount: {
      defaultValue: 47,
    },
  },
} as Meta

const Template: Story = (args) => <Pagination {...args} />

export const Default = Template.bind({})
