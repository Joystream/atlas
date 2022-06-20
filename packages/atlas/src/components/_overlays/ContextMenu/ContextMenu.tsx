import styled from '@emotion/styled'
import { FC, useRef } from 'react'

import { List } from '@/components/List'
import { ListItemProps, ListItemSizes } from '@/components/ListItem'

import { Popover, PopoverImperativeHandle, PopoverProps } from '../Popover'

export type ContextMenuProps = { items: ListItemProps[]; scrollable?: boolean; size?: ListItemSizes } & Omit<
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
      <StyledContainer>
        <List
          scrollable={scrollable}
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

export const StyledContainer = styled.div`
  width: 192px;
`
