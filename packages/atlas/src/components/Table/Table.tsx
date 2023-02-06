import { useState } from 'react'
import { Column, usePagination, useTable } from 'react-table'

import { TablePagination } from '@/components/TablePagination'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { TableBase, Td, Th, Thead, Wrapper } from './Table.styles'

export type TableProps<T = object> = {
  columns: Column[]
  data: T[]
  title?: string
  initialPageSize?: number
}

export const Table = <T extends object>({ columns, data, title, initialPageSize = 20 }: TableProps<T>) => {
  const [pageSize, setPageSize] = useState(initialPageSize)
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    state: { pageIndex },
  } = useTable({ columns, data, initialState: { pageSize } }, usePagination)
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
      <TableBase {...getTableProps()}>
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
          {page.map((row) => {
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
      {data.length < pageSize && (
        <TablePagination
          perPage={pageSize}
          currentPage={pageIndex}
          setPage={gotoPage}
          setPerPage={(perPage) => setPageSize(perPage)}
          totalItemCount={data.length}
        />
      )}
    </Wrapper>
  )
}
