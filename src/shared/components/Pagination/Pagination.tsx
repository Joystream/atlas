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
  url,
  maxPaginationLinks = 5,
}) => {
  const totalPages = take ? Math.ceil(totalCount / take) : 0
  const prevPage = currentPage - 1
  const nextPage = currentPage + 1

  return (
    <PaginationWrapper>
      <StyledLink isChevron={true} to={`/${url}/${prevPage}`}>
        <Icon name="chevron-left" />
      </StyledLink>
      {Array.from({ length: totalPages }).map((_, i) => (
        <StyledLink key={i + 1} to={`/${url}/${i + 1}`}>
          {i + 1}
        </StyledLink>
      ))}
      <StyledLink isChevron={true} to={`/${url}/${nextPage}`}>
        <Icon name="chevron-right" />
      </StyledLink>
    </PaginationWrapper>
  )
}

export default Pagination
