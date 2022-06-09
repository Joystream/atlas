import styled from '@emotion/styled'
import React from 'react'

import { cVar, zIndex } from '@/styles'

import { ListItem, ListItemProps } from '../ListItem'
import { ListItemSizes } from '../ListItem/ListItem.styles'

type ListProps = {
  className?: string
  items: Omit<ListItemProps, 'size'>[]
  size: ListItemSizes
}

export const List: React.FC<ListProps> = ({ items, size, className }) => {
  return (
    <ListWrapper className={className}>
      {items.map((item, index) => (
        <ListItem key={index} {...item} size={size} />
      ))}
    </ListWrapper>
  )
}

const ListWrapper = styled.div`
  width: 100%;
  max-height: 300px;
  position: absolute;
  top: 0;
  overflow-y: auto;
  margin-top: 0;
  z-index: ${zIndex.globalOverlay};
  padding: 0;
  box-shadow: ${cVar('effectElevation16Layer1')};
  background-color: ${cVar('colorBackgroundStrong')};
  list-style: none;
`
