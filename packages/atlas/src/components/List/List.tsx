import { FC } from 'react'

import { ListWrapper } from './List.styles'

import { ListItem, ListItemProps, ListItemSizes } from '../ListItem'

type ListProps = {
  className?: string
  items: Omit<ListItemProps, 'size'>[]
  size: ListItemSizes
  scrollable?: boolean
}

export const List: FC<ListProps> = ({ items, size, className, scrollable = false }) => {
  return (
    <ListWrapper className={className} scrollable={scrollable} size={size}>
      {items.map((item, index) => (
        <ListItem key={index} {...item} size={size} />
      ))}
    </ListWrapper>
  )
}
