import { ReactElement, useMemo } from 'react'
import { Column, usePagination, useTable } from 'react-table'

import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  EmptyTableContainer,
  EmptyTableDescription,
  EmptyTableHeader,
  StyledPagination,
  TableBase,
  Td,
  Th,
  Thead,
  Wrapper,
} from './Table.styles'

export type TableProps<T = object> = {
  columns: Column[]
  data: T[]
  title?: string
  pageSize?: number
  doubleColumn?: boolean
  emptyState?: {
    title: string
    description: string
    icon: ReactElement
  }
}

export const Table = <T extends object>({
  columns,
  data,
  title,
  pageSize = 20,
  emptyState,
  doubleColumn,
}: TableProps<T>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: rawPage,
    prepareRow,
    gotoPage,
    state: { pageIndex },
  } = useTable({ columns, data, initialState: { pageSize } }, usePagination)

  const page = useMemo(() => {
    if (doubleColumn) {
      const sliceIndex = Math.ceil(rawPage.length / 2)
      return [rawPage.slice(0, sliceIndex), rawPage.slice(sliceIndex)]
    }

    return [rawPage]
  }, [doubleColumn, rawPage])

  const mdMatch = useMediaMatch('md')
  return (
    <Wrapper>
      {title && (
        <Text
          as="h3"
          variant={mdMatch ? 'h500' : 'h400'}
          margin={{ top: mdMatch ? 6 : 4, bottom: 6, left: mdMatch ? 6 : 4 }}
        >
          {title}
        </Text>
      )}
      {data.length ? (
        <div style={{ display: 'flex', gap: 10 }}>
          {page.map((subpage, idx) => (
            <TableBase {...getTableProps()} key={`table-slice-${idx}`}>
              <Thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
                    {headerGroup.headers.map((column) => (
                      <Th
                        variant="h100"
                        as="th"
                        color="colorText"
                        {...column.getHeaderProps()}
                        key={column.getHeaderProps().key}
                      >
                        {column.render('Header')}
                      </Th>
                    ))}
                  </tr>
                ))}
              </Thead>
              <tbody {...getTableBodyProps()}>
                {subpage.map((row) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()} key={row.getRowProps().key}>
                      {row.cells.map((cell) => (
                        <Td variant="t100" as="td" {...cell.getCellProps()} key={cell.getCellProps().key}>
                          {cell.render('Cell')}
                        </Td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </TableBase>
          ))}
        </div>
      ) : emptyState ? (
        <EmptyTableContainer>
          {emptyState.icon}
          <EmptyTableHeader variant="h500" as="h5">
            {emptyState.title}
          </EmptyTableHeader>
          <EmptyTableDescription variant="t200" as="p" color="colorText">
            {emptyState.description}
          </EmptyTableDescription>
        </EmptyTableContainer>
      ) : null}

      {data.length > pageSize && (
        <StyledPagination onChangePage={gotoPage} page={pageIndex} itemsPerPage={pageSize} totalCount={data.length} />
      )}
    </Wrapper>
  )
}
