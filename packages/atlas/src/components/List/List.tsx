import React from 'react'

import { ListWrapper } from './List.styles'

import { ListItem, ListItemProps } from '../ListItem'
import { ListItemSizes } from '../ListItem/ListItem.styles'

type ListProps = {
  className?: string
  items: Omit<ListItemProps, 'size'>[]
  size: ListItemSizes
  scrollable?: boolean
}

export const List: React.FC<ListProps> = ({ items, size, className, scrollable = false }) => {
  return (
    <ListWrapper className={className} scrollable={scrollable} size={size}>
      {items.map((item, index) => (
        <ListItem key={index} {...item} size={size} />
      ))}
    </ListWrapper>
  )
}
