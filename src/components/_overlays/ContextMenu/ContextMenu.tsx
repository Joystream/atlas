import React, { ReactNode, useRef } from 'react'

import { ListItem } from '@/components/ListItem'

import { StyledContainer } from './ContextMenu.styles'

import { Popover, PopoverImperativeHandle, PopoverProps } from '../Popover'

export type MenuItemProps = {
  icon: ReactNode
  title: string
  onClick?: () => void
  disabled?: boolean
}

type ContextMenuProps = { items: MenuItemProps[] } & Omit<PopoverProps, 'content' | 'instanceRef'>

export const ContextMenu: React.FC<ContextMenuProps> = ({ children, items, ...rest }) => {
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)
  return (
    <Popover hideOnClick ref={contextMenuInstanceRef} {...rest}>
      <StyledContainer>
        {items.map((item, index) => (
          <ListItem
            key={index}
            onClick={() => {
              item.onClick?.()
              contextMenuInstanceRef.current?.hide()
            }}
            label={item.title}
            nodeStart={item.icon}
          />
        ))}
      </StyledContainer>
    </Popover>
  )
}
