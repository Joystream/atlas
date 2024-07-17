import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SvgActionArrowBottom, SvgActionArrowTop } from '@/assets/icons'
import { Pagination } from '@/components/Pagination'
import { Text } from '@/components/Text'
import { cVar, sizes, square } from '@/styles'

export const DescIndicator = styled(SvgActionArrowBottom)`
  ${square(16)};

  margin-right: 2px;

  path {
    fill: ${cVar('colorTextPrimary')};
  }
`

export const AscIndicator = styled(SvgActionArrowTop)`
  ${square(16)};

  margin-right: 2px;

  path {
    fill: ${cVar('colorTextPrimary')};
  }
`

export const Wrapper = styled.div<{ interactive?: boolean }>`
  background-color: ${cVar('colorBackgroundMuted')};
  overflow: auto;

  * {
    .pointer {
      cursor: pointer;
    }
  }

  ${(props) =>
    props.interactive
      ? css`
          .table-row {
            transition: background-color 300ms ease-in-out;
            border-radius: ${cVar('radiusMedium')};

            :hover {
              cursor: pointer;
              background: ${cVar('colorBackgroundMutedAlpha')};
            }
          }
        `
      : ''}
`

export const AnchorRow = styled(Link)`
  text-decoration: none;
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

export const PageWrapper = styled.div<{ minWidth: number }>`
  display: flex;
  gap: ${sizes(6)};
  min-width: ${(props) => `${props.minWidth}px`};
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

export const TableWrapper = styled.div`
  scrollbar-width: none;
  position: relative;
  overflow-x: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`
