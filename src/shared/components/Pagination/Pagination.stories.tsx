import { Meta, Story } from '@storybook/react'
import React from 'react'
import Pagination from './Pagination'

export default {
  title: 'Shared/Pagination',
  component: Pagination,
  argTypes: {
    itemsPerPage: {
      defaultValue: 10,
    },
    totalCount: {
      defaultValue: 90,
    },
  },
} as Meta

const Template: Story = (args) => <Pagination {...args} />

export const Default = Template.bind({})
