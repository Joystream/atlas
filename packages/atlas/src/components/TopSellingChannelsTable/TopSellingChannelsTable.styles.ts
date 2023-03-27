import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { ListItem } from '@/components/ListItem'
import { Table } from '@/components/Table'
import { cVar, sizes } from '@/styles'

export const StyledTable = styled(Table)`
  background: transparent;

  .table-base {
    border-bottom: 1px solid ${cVar('colorBorderMutedAlpha')}!important;
  }

  .table-row {
    background-color: transparent;
  }

  .table-header {
    box-shadow: 0 1px 0 0 ${cVar('colorBorderMutedAlpha')};
    background-color: transparent;

    th {
      :first-of-type {
        padding-left: 5px;
      }
    }
  }
`

export const SenderItem = styled(ListItem)`
  padding-left: 0;
  width: fit-content;
  align-items: center;

  & span[color] {
    color: ${cVar('colorTextStrong')};
  }
`

export const SenderItemIconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${sizes(1)};

  svg {
    path {
      fill: ${cVar('colorTextMuted')};
    }
  }
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`

export const JoyAmountWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`
