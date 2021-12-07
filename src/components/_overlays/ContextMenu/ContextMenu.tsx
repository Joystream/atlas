import React, { ReactNode, useRef } from 'react'

import { StyledContainer, StyledMenuItem, StyledText } from './ContextMenu.styles'

import { Popover, PopoverImperativeHandle, PopoverProps } from '../Popover'

type MenuItemProps = {
  icon: ReactNode
  title: string
  onClick?: () => void
  disabled?: boolean
}

export const ContextMenuItem: React.FC<MenuItemProps> = React.memo(({ icon, onClick, title }) => {
  return (
    <StyledMenuItem onClick={onClick}>
      {icon}
      <StyledText variant="t200">{title}</StyledText>
    </StyledMenuItem>
  )
})

ContextMenuItem.displayName = 'ContextMenuItem'

type ContextMenuProps = { items: MenuItemProps[] } & Omit<PopoverProps, 'content' | 'instanceRef'>

export const ContextMenu: React.FC<ContextMenuProps> = ({ children, items, ...rest }) => {
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)
  return (
    <Popover hideOnClick ref={contextMenuInstanceRef} {...rest}>
      <StyledContainer>
        {items.map((item, index) => (
          <ContextMenuItem
            key={index}
            icon={item.icon}
            title={item.title}
            onClick={() => {
              item.onClick?.()
              contextMenuInstanceRef.current?.hide()
            }}
          />
        ))}
      </StyledContainer>
    </Popover>
  )
}
