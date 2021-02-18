import React, { useState } from 'react'
import Icon from '../Icon'
import { PaginationWrapper, PaginationButton } from './Pagination.style'

export type PaginationProps = {
  itemsPerPage?: number
  totalCount?: number
  maxPaginationLinks?: number
  onChangePage: (page: number) => void
  page: number
}

const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage = 0,
  totalCount = 0,
  maxPaginationLinks = 5,
  page = 0,
  onChangePage,
}) => {
  const totalPages = itemsPerPage ? Math.ceil(totalCount / itemsPerPage) : 0
  const prevPage = page - 1
  const nextPage = page + 1

  const pages = generatePaginationArray(page, maxPaginationLinks, totalPages)

  return (
    <PaginationWrapper>
      <PaginationButton
        isHidden={page <= 1}
        isChevron={true}
        onClick={() => onChangePage(prevPage)}
        tabIndex={page <= 1 ? -1 : 0}
      >
        <Icon name="chevron-left" />
      </PaginationButton>
      {pages.map((pageItem) => (
        <PaginationButton
          isActive={page ? page === pageItem : pageItem === 1}
          key={pageItem}
          onClick={() => onChangePage(pageItem)}
        >
          {pageItem}
        </PaginationButton>
      ))}
      <PaginationButton
        isHidden={nextPage > totalPages}
        isChevron={true}
        onClick={() => (page ? onChangePage(nextPage) : onChangePage(2))}
        tabIndex={nextPage <= totalPages ? -1 : 0}
      >
        <Icon name="chevron-right" />
      </PaginationButton>
    </PaginationWrapper>
  )
}

const generatePaginationArray = (currentPage: number, maxPaginationLinks: number, totalPages: number) => {
  const paginationArray = Array.from({ length: totalPages }).map((_, idx) => idx + 1)
  const center = Math.floor(maxPaginationLinks / 2)

  if (currentPage + center <= totalPages) {
    const start = Math.max(currentPage - 1 - center, 0)
    const end = start + maxPaginationLinks
    return paginationArray.slice(start, end)
  } else {
    return paginationArray.slice(-maxPaginationLinks)
  }
}

export default Pagination
