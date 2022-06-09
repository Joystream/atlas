import { FC, useRef } from 'react'

import { List } from '@/components/List'
import { ListItemProps } from '@/components/ListItem'

import { ContextMenuSizes, StyledContainer } from './ContextMenu.styles'

import { Popover, PopoverImperativeHandle, PopoverProps } from '../Popover'

export type ContextMenuProps = { items: ListItemProps[]; scrollable?: boolean; size?: ContextMenuSizes } & Omit<
  PopoverProps,
  'content' | 'instanceRef'
>

export const ContextMenu: FC<ContextMenuProps> = ({
  children,
  items,
  scrollable = false,
  size = 'medium',
  ...rest
}) => {
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)
  return (
    <Popover hideOnClick ref={contextMenuInstanceRef} {...rest}>
      <StyledContainer scrollable={scrollable} size={size}>
        <List
          size={size}
          items={items.map((item) => ({
            ...item,
            onClick: (e) => {
              item.onClick?.(e)
              contextMenuInstanceRef.current?.hide()
            },
          }))}
        />
      </StyledContainer>
    </Popover>
  )
}
