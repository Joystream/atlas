import React, { useState } from 'react'
import Icon from '../Icon'
import { PaginationWrapper, PaginationButton } from './Pagination.style'

type PaginationProps = {
  itemsForPage?: number
  totalCount?: number
  currentPage?: number
  maxPaginationLinks?: number
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Pagination: React.FC<PaginationProps> = ({
  itemsForPage = 0,
  totalCount = 0,
  currentPage = 1,
  maxPaginationLinks = 5,
  onClick,
}) => {
  const [page, setPage] = useState(currentPage)
  const totalPages = itemsForPage ? Math.ceil(totalCount / itemsForPage) : 0
  const prevPage = page - 1
  const nextPage = page + 1

  const pages = generatePaginationArray(page, maxPaginationLinks, totalPages)

  const handleButtonClick = (page: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick && onClick(e)
    setPage(page)
  }

  return (
    <PaginationWrapper>
      <PaginationButton
        isHidden={page <= 1}
        isChevron={true}
        onClick={(e) => handleButtonClick(prevPage, e)}
        tabIndex={page <= 1 ? -1 : 0}
      >
        <Icon name="chevron-left" />
      </PaginationButton>
      {pages.map((pageItem) => (
        <PaginationButton isActive={page === pageItem} key={pageItem} onClick={(e) => handleButtonClick(pageItem, e)}>
          {pageItem}
        </PaginationButton>
      ))}
      <PaginationButton
        isHidden={nextPage > totalPages}
        isChevron={true}
        onClick={(e) => handleButtonClick(nextPage, e)}
        tabIndex={nextPage <= totalPages ? -1 : 0}
      >
        <Icon name="chevron-right" />
      </PaginationButton>
    </PaginationWrapper>
  )
}

const generatePaginationArray = (currentPage: number, maxPaginationLinks: number, totalPages: number) => {
  const array = Array.from({ length: totalPages }).map((_, idx) => idx + 1)

  const center = Math.floor(maxPaginationLinks / 2)
  if (currentPage + center <= totalPages) {
    const start = Math.max(currentPage - 1 - center, 0)
    return array.slice(start, start + maxPaginationLinks)
  } else {
    return array.slice(-maxPaginationLinks)
  }
}

export default Pagination
