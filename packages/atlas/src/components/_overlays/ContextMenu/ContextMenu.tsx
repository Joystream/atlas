import styled from '@emotion/styled'
import { forwardRef, useRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { List } from '@/components/List'
import { ListItemProps, ListItemSizes } from '@/components/ListItem'

import { Popover, PopoverImperativeHandle, PopoverProps } from '../Popover'

export type ContextMenuProps = {
  items: ListItemProps[]
  scrollable?: boolean
  size?: ListItemSizes
} & Omit<PopoverProps, 'content' | 'instanceRef'>

export const ContextMenu = forwardRef<PopoverImperativeHandle, ContextMenuProps>(
  ({ children, items, scrollable = false, size = 'medium', ...rest }, ref) => {
    const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)
    return (
      <Popover hideOnClick ref={mergeRefs([contextMenuInstanceRef, ref])} {...rest}>
        <StyledList
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
      </Popover>
    )
  }
)

ContextMenu.displayName = 'ContextMenu'
export const StyledList = styled(List)`
  width: 192px;
`
