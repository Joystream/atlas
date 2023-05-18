import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { ListItem } from '@/components/ListItem'
import { Table } from '@/components/Table'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import { LabelContainer, LabelText } from '../ListItem/ListItem.styles'

export const ScrollWrapper = styled.div`
  scrollbar-width: none;
  position: relative;
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const StyledTable = styled(Table)`
  background: transparent;
  min-width: 528px;

  .table-base {
    height: fit-content;
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

export const StyledListItem = styled(ListItem)`
  padding-left: 0;
  width: fit-content;
  align-items: center;

  ${LabelContainer} {
    overflow: hidden;
  }

  ${LabelText} {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  margin-left: auto;
`

export const SkeletonChannelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

export const NftSoldText = styled(Text)`
  margin-left: auto;
`
