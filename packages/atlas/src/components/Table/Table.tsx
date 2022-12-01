import { Column, usePagination, useTable } from 'react-table'

import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { StyledPagination, TableBase, Td, Th, Thead, Wrapper } from './Table.styles'

export type TableProps<T = object> = {
  columns: Column[]
  data: T[]
  title?: string
  pageSize?: number
  minWidth?: string
}

export const Table = <T extends object>({ columns, data, title, pageSize = 20, minWidth }: TableProps<T>) => {
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
      <TableBase minWidth={minWidth} {...getTableProps()}>
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
      {data.length > pageSize && (
        <StyledPagination onChangePage={gotoPage} page={pageIndex} itemsPerPage={pageSize} totalCount={data.length} />
      )}
    </Wrapper>
  )
}
