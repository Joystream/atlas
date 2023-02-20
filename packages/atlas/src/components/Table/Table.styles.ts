import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Pagination } from '@/components/Pagination'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};
  overflow: auto;
`

export const TableBase = styled.table`
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
`

export const Thead = styled.thead`
  background-color: ${cVar('colorBackground')};
`

const cellStyles = css`
  padding: ${sizes(3.5)} ${sizes(2)};
  max-height: 72px;

  :first-of-type {
    padding-left: ${sizes(6)};
  }

  :last-of-type {
    padding-right: ${sizes(6)};
  }
`

export const Th = styled(Text)<{ width?: string | number }>`
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width ?? 'unset')};
  ${cellStyles};

  text-align: left;
`

export const Td = styled(Text)`
  ${cellStyles};

  overflow: hidden;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  box-shadow: ${cVar('effectDividersBottom')};
`

export const StyledPagination = styled(Pagination)`
  margin: ${sizes(6)} 0;
`

export const EmptyTableContainer = styled.div`
  display: grid;
  width: min(100%, 400px);
  place-content: center;
  justify-items: center;
  margin: ${sizes(10)} auto;
  padding: 0 ${sizes(4)};
`

export const EmptyTableHeader = styled(Text)`
  margin-top: ${sizes(10)};
  text-align: center;
`

export const EmptyTableDescription = styled(Text)`
  text-align: center;
  margin-top: ${sizes(2)};
`
