import { Meta, Story } from '@storybook/react'
import React from 'react'
import { MemoryRouter, Route, useLocation } from 'react-router-dom'
import Pagination from './Pagination'

const Router: React.FC = (children) => {
  return <MemoryRouter>{children}</MemoryRouter>
}

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
  decorators: [
    (story) => {
      return <MemoryRouter>{story()}</MemoryRouter>
    },
  ],
} as Meta

const Template: Story = (args) => <Pagination {...args} />

export const Default = Template.bind({})
