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

  :first-of-type {
    padding-left: ${sizes(6)};
  }

  :last-of-type {
    padding-right: ${sizes(6)};
  }
`

export const Th = styled(Text)`
  ${cellStyles};

  text-align: left;
`

export const Td = styled(Text)`
  ${cellStyles};

  box-shadow: ${cVar('effectDividersBottom')};
`

export const StyledPagination = styled(Pagination)`
  margin: ${sizes(6)} 0;
`
