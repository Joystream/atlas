import React, { ReactNode } from 'react'
import { CSSTransition } from 'react-transition-group'

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

export const ContextMenu: React.FC<PopoverBaseProps> = ({ children, isVisible, ...rest }) => {
  return (
    <PopoverBase isVisible={isVisible} {...rest}>
      <CSSTransition in={isVisible} timeout={150} classNames="menu" unmountOnExit>
        <StyledContainer>{children}</StyledContainer>
      </CSSTransition>
    </PopoverBase>
  )
}
