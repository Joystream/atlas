import React from 'react'
import { PaginationWrapper, PaginationButton, ChevronButton, ThreeDotsWrapper } from './Pagination.style'
import { SvgGlyphChevronLeft, SvgGlyphChevronRight } from '@/shared/icons'

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

  const handleChangePage = (pageItem: number | string) => {
    if (typeof pageItem === 'number') {
      onChangePage(pageItem - 1)
    }
  }

  return (
    <PaginationWrapper>
      <ChevronButton
        variant="secondary"
        size="large"
        onClick={() => onChangePage(prevPage - 1)}
        disabled={internalPage <= 1}
      >
        <SvgGlyphChevronLeft />
      </ChevronButton>
      {pages.map((pageItem, idx) =>
        typeof pageItem === 'number' ? (
          <PaginationButton
            isActive={internalPage ? internalPage === pageItem : pageItem === 1}
            key={idx}
            onClick={() => handleChangePage(pageItem)}
          >
            {pageItem}
          </PaginationButton>
        ) : (
          <ThreeDotsWrapper key={idx}>{pageItem}</ThreeDotsWrapper>
        )
      )}
      <ChevronButton
        size="large"
        variant="secondary"
        onClick={() => (internalPage ? onChangePage(nextPage - 1) : onChangePage(2))}
        disabled={internalPage >= totalPages}
      >
        <SvgGlyphChevronRight />
      </ChevronButton>
    </PaginationWrapper>
  )
}

const generatePaginationArray = (currentPage: number, maxPaginationLinks: number, totalPages: number) => {
  const paginationArray = Array.from({ length: totalPages }).map((_, idx) => idx + 1)

  const center =
    maxPaginationLinks % 2 === 0 ? Math.floor(maxPaginationLinks / 2 - 1) : Math.floor(maxPaginationLinks / 2)

  let slicedArray: Array<number>

  if (currentPage + center < totalPages) {
    const start =
      maxPaginationLinks === 4
        ? Math.min(currentPage - 1, totalPages - maxPaginationLinks)
        : Math.max(currentPage - 1 - center, 0)
    const end = start + maxPaginationLinks

    slicedArray = paginationArray.slice(start, end)
  } else {
    slicedArray = paginationArray.slice(-maxPaginationLinks)
  }
  if (maxPaginationLinks <= 3) {
    return slicedArray
  }

  const arrayWithDots = slicedArray.map((el, idx) => {
    // first page
    if (idx === 0 && maxPaginationLinks !== 4) {
      return 1
    }
    // last page
    if (idx === slicedArray.length - 1) {
      return totalPages
    }
    // show left "..."
    if (idx === 1 && el - 1 !== 1 && maxPaginationLinks !== 4) {
      return '...'
    }
    // show right "..."
    if (idx === slicedArray.length - 2 && el + 1 !== totalPages) {
      return '...'
    }
    return el
  })
  return arrayWithDots
}

export default Pagination
