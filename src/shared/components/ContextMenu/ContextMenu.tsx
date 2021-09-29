import React, { ReactNode } from 'react'

import { StyledContainer, StyledMenuItem, StyledText } from './ContextMenu.style'

import { Popover, PopoverProps } from '../Popover'

type MenuItemProps = {
  icon: ReactNode
  onClick: () => void
}

export const ContextMenuItem: React.FC<MenuItemProps> = ({ icon, children, onClick }) => {
  return (
    <StyledMenuItem onClick={onClick}>
      {icon}
      <StyledText>{children}</StyledText>
    </StyledMenuItem>
  )
}

export const ContextMenu: React.FC<PopoverProps> = ({ children, content, ...rest }) => {
  return (
    <Popover content={<StyledContainer>{content}</StyledContainer>} {...rest}>
      {children}
    </Popover>
  )
}
