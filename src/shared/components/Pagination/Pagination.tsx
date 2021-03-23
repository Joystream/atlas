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

// Codewise component works with index starting from 0 but it's rendered with index starting from 1
const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage = 0,
  totalCount = 0,
  maxPaginationLinks = 5,
  page = 0,
  onChangePage,
}) => {
  const internalPage = page + 1
  const totalPages = itemsPerPage ? Math.ceil(totalCount / itemsPerPage) : 0
  const prevPage = internalPage - 1
  const nextPage = internalPage + 1

  const pages = generatePaginationArray(internalPage, maxPaginationLinks, totalPages)

  if (totalPages <= 1) return null

  return (
    <PaginationWrapper>
      <PaginationButton
        isHidden={internalPage <= 1}
        isChevron={true}
        onClick={() => onChangePage(prevPage - 1)}
        tabIndex={internalPage <= 1 ? -1 : 0}
      >
        <Icon name="chevron-left" />
      </PaginationButton>
      {pages.map((pageItem) => (
        <PaginationButton
          isActive={internalPage ? internalPage === pageItem : pageItem === 1}
          key={pageItem}
          onClick={() => onChangePage(pageItem - 1)}
        >
          {pageItem}
        </PaginationButton>
      ))}
      <PaginationButton
        isHidden={nextPage > totalPages}
        isChevron={true}
        onClick={() => (internalPage ? onChangePage(nextPage - 1) : onChangePage(2))}
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
