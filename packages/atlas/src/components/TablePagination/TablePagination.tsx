import { FC, useCallback, useMemo } from 'react'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'
import { Container, HorizontalContainer, PageInfo } from '@/components/TablePagination/TablePagination.styles'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'

import { Select, SelectItem } from '../_inputs/Select'

const PER_PAGE_ITEMS: SelectItem[] = [
  {
    value: '10',
    name: '10',
  },
  {
    value: '20',
    name: '20',
  },

  {
    value: '50',
    name: '50',
  },

  {
    value: '100',
    name: '100',
  },
]

type TablePaginationProps = {
  totalItemCount: number
  currentPage: number
  setPage: (page: number) => void
  perPage: number
  setPerPage: (perPage: number) => void
}

export const TablePagination: FC<TablePaginationProps> = ({
  perPage,
  setPerPage,
  totalItemCount,
  currentPage,
  setPage,
}) => {
  const pagesCount = Math.max(Math.ceil(totalItemCount / perPage), 1)
  const pageItems = useMemo(
    (): SelectItem[] =>
      Array.from({ length: pagesCount }, (_, idx) => ({
        name: String(idx + 1),
        value: String(idx + 1),
      })),
    [pagesCount]
  )

  const handlePerPageChange = useCallback(
    (value?: string | null) => {
      if (value) {
        setPerPage(+value)
        setPage(0)
      }
    },
    [setPage, setPerPage]
  )

  return (
    <Container>
      <HorizontalContainer>
        <Select
          icon={
            <Text as="p" variant="t200" color="colorText">
              Rows per page:
            </Text>
          }
          value={String(perPage)}
          onChange={handlePerPageChange}
          items={PER_PAGE_ITEMS}
        />
        <PageInfo as="p" variant="t200" color="colorTextStrong">
          {!totalItemCount
            ? 0
            : `${1 + perPage * currentPage}-${Math.min(
                perPage + perPage * currentPage,
                totalItemCount
              )} of ${totalItemCount}`}{' '}
          items
        </PageInfo>
      </HorizontalContainer>
      <HorizontalContainer>
        <HorizontalContainer>
          <Select
            value={String(currentPage + 1)}
            onChange={(value) => value && setPage(+value - 1)}
            items={pageItems}
          />
          <PageInfo as="p" variant="t200" color="colorTextStrong">
            of {pagesCount} pages
          </PageInfo>
        </HorizontalContainer>
        <HorizontalContainer>
          <Button
            variant="tertiary"
            icon={<SvgActionChevronL />}
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
          />
          <Button
            variant="tertiary"
            icon={<SvgActionChevronR />}
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage + 1 === pagesCount}
          />
        </HorizontalContainer>
      </HorizontalContainer>
    </Container>
  )
}
