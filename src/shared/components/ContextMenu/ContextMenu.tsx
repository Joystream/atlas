import React, { ReactNode, useRef } from 'react'

import { StyledContainer, StyledMenuItem, StyledText } from './ContextMenu.style'

import { Popover, PopoverProps, TippyInstance } from '../Popover'

type MenuItemProps = {
  icon: ReactNode
  title: string
  onClick?: () => void
}

export const ContextMenuItem: React.FC<MenuItemProps> = ({ icon, onClick, title }) => {
  return (
    <StyledMenuItem onClick={onClick}>
      {icon}
      <StyledText>{title}</StyledText>
    </StyledMenuItem>
  )
}

type ContextMenuProps = { items: MenuItemProps[] } & Omit<PopoverProps, 'content' | 'instanceRef'>

export const ContextMenu: React.FC<ContextMenuProps> = ({ children, items, ...rest }) => {
  const contextMenuInstanceRef = useRef<TippyInstance>()
  return (
    <Popover
      hideOnClick
      instanceRef={contextMenuInstanceRef}
      content={
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
      }
      {...rest}
    >
      {children}
    </Popover>
  )
}
