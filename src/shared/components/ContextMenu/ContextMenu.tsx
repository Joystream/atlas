import React, { ReactNode } from 'react'

import { StyledContainer, StyledMenuItem, StyledText } from './ContextMenu.style'

import { PopoverBase, PopoverBaseProps } from '../PopoverBase/PopoverBase'

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

export const ContextMenu: React.FC<PopoverBaseProps> = ({ children, content, ...rest }) => {
  return (
    <PopoverBase content={<StyledContainer>{content}</StyledContainer>} {...rest}>
      {children}
    </PopoverBase>
  )
}
