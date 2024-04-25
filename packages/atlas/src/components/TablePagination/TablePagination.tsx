import { FC, useCallback, useMemo } from 'react'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Container, HorizontalContainer, PageInfo } from '@/components/TablePagination/TablePagination.styles'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

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

export type TablePaginationProps = {
  setPerPage?: (perPage: number) => void
  onChangePage: (page: number) => void
  className?: string
  itemsPerPage: number
  totalCount: number
  page: number
}

export const TablePagination: FC<TablePaginationProps> = ({
  itemsPerPage,
  setPerPage,
  totalCount,
  page,
  onChangePage,
  className,
}) => {
  const smMatch = useMediaMatch('sm')
  const pagesCount = Math.max(Math.ceil(totalCount / itemsPerPage), 1)
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
        setPerPage?.(+value)
        onChangePage(0)
      }
    },
    [onChangePage, setPerPage]
  )

  return (
    <Container className={className}>
      {setPerPage ? (
        <HorizontalContainer>
          <div>
            <Select
              icon={
                <Text as="p" variant={smMatch ? 't200' : 't100'} color="colorText">
                  {smMatch ? 'Rows per page:' : 'Rows:'}
                </Text>
              }
              value={String(itemsPerPage)}
              onChange={handlePerPageChange}
              items={PER_PAGE_ITEMS}
            />
          </div>
          <PageInfo as="p" variant={smMatch ? 't200' : 't100'} color="colorTextStrong">
            {!totalCount
              ? 0
              : `${1 + itemsPerPage * page}-${Math.min(
                  itemsPerPage + itemsPerPage * page,
                  totalCount
                )} of ${totalCount}`}{' '}
            items
          </PageInfo>
        </HorizontalContainer>
      ) : null}

      <HorizontalContainer>
        <FlexBox gap={4} width="auto" alignItems="center">
          <Select value={String(page + 1)} onChange={(value) => value && onChangePage(+value - 1)} items={pageItems} />
          <PageInfo as="p" variant={smMatch ? 't200' : 't100'} color="colorTextStrong">
            of {pagesCount} pages
          </PageInfo>
        </FlexBox>
        <FlexBox width="auto">
          <Button
            variant="tertiary"
            icon={<SvgActionChevronL />}
            onClick={() => onChangePage(page - 1)}
            disabled={page === 0}
          />
          <Button
            variant="tertiary"
            icon={<SvgActionChevronR />}
            onClick={() => onChangePage(page + 1)}
            disabled={page + 1 === pagesCount}
          />
        </FlexBox>
      </HorizontalContainer>
    </Container>
  )
}
