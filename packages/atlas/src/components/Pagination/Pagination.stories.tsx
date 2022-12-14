import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { Pagination, PaginationProps } from './Pagination'

export default {
  title: 'other/Pagination',
  component: Pagination,
  args: {
    itemsPerPage: 10,
    totalCount: 90,
  },
} as Meta<PaginationProps>

const Template: StoryFn<PaginationProps> = (args) => {
  const [currentPage, setCurrentPage] = useState(0)

  const handleChangePage = (page: number) => {
    setCurrentPage(page)
  }

  return <Pagination {...args} onChangePage={handleChangePage} page={currentPage} />
}

export const Default = Template.bind({})
