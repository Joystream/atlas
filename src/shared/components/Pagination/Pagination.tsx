import React, { useState } from 'react'
import Icon from '../Icon'
import { PaginationWrapper, PaginationButton } from './Pagination.style'

type PaginationProps = {
  take?: number
  totalCount?: number
  currentPage?: number
  url?: string
  maxPaginationLinks?: number
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Pagination: React.FC<PaginationProps> = ({
  take = 0,
  totalCount = 0,
  currentPage = 1,
  maxPaginationLinks = 5,
  onClick,
}) => {
  const [page, setPage] = useState(currentPage)
  const totalPages = take ? Math.ceil(totalCount / take) : 0
  const prevPage = page - 1
  const nextPage = page + 1

  const pages = generatePaginationArray(page, maxPaginationLinks, totalPages)

  const handleButtonClick = (page: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick && onClick(e)
    setPage(page)
  }

  return (
    <PaginationWrapper>
      {page > 1 && (
        <PaginationButton isChevron={true} onClick={(e) => handleButtonClick(prevPage, e)}>
          <Icon name="chevron-left" />
        </PaginationButton>
      )}
      {pages.map((pageItem) => (
        <PaginationButton isActive={page === pageItem} key={pageItem} onClick={(e) => handleButtonClick(pageItem, e)}>
          {pageItem}
        </PaginationButton>
      ))}
      {nextPage <= totalPages && (
        <PaginationButton isChevron={true} onClick={(e) => handleButtonClick(nextPage, e)}>
          <Icon name="chevron-right" />
        </PaginationButton>
      )}
    </PaginationWrapper>
  )
}

const generatePaginationArray = (currentPage: number, maxPaginationLinks: number, totalPages: number) => {
  const array = Array.from({ length: totalPages }).map((_, idx) => idx + 1)

  if (currentPage + maxPaginationLinks <= totalPages) {
    const center = Math.ceil(maxPaginationLinks / 2)
    const start = Math.max(currentPage - 1 - center, 0)

    return array.slice(start, start + maxPaginationLinks)
  } else {
    return array.slice(-maxPaginationLinks)
  }
}

export default Pagination
