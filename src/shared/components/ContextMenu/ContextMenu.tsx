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

export const ContextMenu: React.FC<PopoverBaseProps> = ({ children, content, ...rest }) => {
  return (
    <PopoverBase
      hideOnClick
      content={
        <CSSTransition in timeout={150} classNames="menu" unmountOnExit>
          <StyledContainer>{content}</StyledContainer>
        </CSSTransition>
      }
      {...rest}
    >
      {children}
    </PopoverBase>
  )
}
