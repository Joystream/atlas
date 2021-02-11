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
  currentPage = 0,
  url = '',
  maxPaginationLinks = 5,
}) => {
  const totalPages = take ? Math.ceil(totalCount / take) : 0
  const prevPage = currentPage - 1
  const nextPage = currentPage + 1
  const startingIdx = getStartingIdx(currentPage, maxPaginationLinks, totalPages)

  return (
    <PaginationWrapper>
      {startingIdx > 1 && (
        <StyledLink isChevron={true} to={`${url}/${prevPage}`}>
          <Icon name="chevron-left" />
        </StyledLink>
      )}
      {Array.from({ length: totalPages })
        .map((_, i) => (
          <StyledLink key={i + startingIdx} to={`${url}/${i + startingIdx}`}>
            {i + startingIdx}
          </StyledLink>
        ))
        .slice(0, maxPaginationLinks)}
      {nextPage <= totalPages && (
        <StyledLink isChevron={true} to={`${url}/${nextPage}`}>
          <Icon name="chevron-right" />
        </StyledLink>
      )}
    </PaginationWrapper>
  )
}

const getStartingIdx = (currentPage: number, maxPaginationLinks: number, totalPages: number) => {
  const center = Math.ceil(maxPaginationLinks / 2) - 1
  if (center <= 0) {
    return 1
  }
  if (currentPage + maxPaginationLinks >= totalPages) {
    return totalPages - maxPaginationLinks
  }
  if (currentPage > center) {
    return currentPage - center
  }
  return 1
}
export default Pagination
