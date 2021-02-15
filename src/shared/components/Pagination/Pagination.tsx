import React from 'react'
import Icon from '../Icon'
import { PaginationWrapper, StyledLink } from './Pagination.style'

type PaginationProps = {
  take?: number
  totalCount?: number
  currentPage?: number
  url?: string
  maxPaginationLinks?: number
}

const Pagination: React.FC<PaginationProps> = ({
  take = 0,
  totalCount = 0,
  currentPage = 1,
  url = '',
  maxPaginationLinks = 5,
}) => {
  const totalPages = take ? Math.ceil(totalCount / take) : 0
  const prevPage = currentPage - 1
  const nextPage = currentPage + 1

  const pages = generatePaginationArray(currentPage, maxPaginationLinks, totalPages)

  return (
    <PaginationWrapper>
      {currentPage > 1 && (
        <StyledLink isChevron={true} to={`${url}/${prevPage}`}>
          <Icon name="chevron-left" />
        </StyledLink>
      )}
      {pages.map((page) => (
        <StyledLink key={page} to={`${url}/${page}`}>
          {page}
        </StyledLink>
      ))}
      {nextPage <= totalPages && (
        <StyledLink isChevron={true} to={`${url}/${nextPage}`}>
          <Icon name="chevron-right" />
        </StyledLink>
      )}
    </PaginationWrapper>
  )
}

const generatePaginationArray = (currentPage: number, maxPaginationLinks: number, totalPages: number) => {
  const array = Array.from({ length: totalPages }).map((_, idx) => idx + 1)
  if (currentPage + maxPaginationLinks <= totalPages) {
    return array.slice(currentPage - 1, currentPage - 1 + maxPaginationLinks)
  } else {
    return array.slice(-maxPaginationLinks)
  }
}

export default Pagination
