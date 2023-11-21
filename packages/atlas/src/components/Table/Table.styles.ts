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
  display: flex;
  align-items: center;

  :first-of-type {
    padding-left: ${sizes(6)};
  }

  :last-of-type {
    padding-right: ${sizes(6)};
  }
`

export const Th = styled(Text)`
  ${cellStyles};

  white-space: nowrap;
`

export const Td = styled(Text)`
  ${cellStyles};

  align-items: start;
  flex-direction: column;
  justify-content: center;
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

export const PageWrapper = styled.div`
  display: flex;
  gap: ${sizes(6)};
`

export const RightAlignedHeader = styled.div`
  width: 100%;
  text-align: right;
`

export const RowBox = styled.div<{ align?: 'start' | 'end' }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${sizes(1)};
  align-items: ${(props) => (props.align === 'end' ? 'flex-end' : 'flex-start')};
`

export const ColumnBox = styled.div`
  display: flex;
  gap: ${sizes(2)};
  width: 100%;
  align-items: center;
`

export const OverflowTableWrapper = styled.div<{ minWidth: number }>`
  > * {
    min-width: ${(props) => `${props.minWidth}px`};
  }

  overflow-x: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`
