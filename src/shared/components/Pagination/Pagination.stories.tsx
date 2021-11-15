import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { Pagination, PaginationProps } from './Pagination'

export default {
  title: 'other/Pagination',
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

const Template: Story<PaginationProps> = (args) => {
  const [currentPage, setCurrentPage] = useState(0)

  const handleChangePage = (page: number) => {
    setCurrentPage(page)
  }

  return <Pagination {...args} onChangePage={handleChangePage} page={currentPage} />
}

export const Default = Template.bind({})
