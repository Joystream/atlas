import React, { ReactNode } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Portal } from '@/components/Portal'
import { useOverlayManager } from '@/providers/overlayManager'

import { StyledContainer, StyledMenuItem, StyledText } from './ContextMenu.style'

type MenuItemProps = {
  icon: ReactNode
  onClick: () => void
}

type ContextMenuProps = {
  contextMenuOpts: {
    isActive?: boolean
    position: { x: number; y: number; left: boolean }
  }
}

export const ContextMenuItem: React.FC<MenuItemProps> = ({ icon, children, onClick }) => {
  return (
    <StyledMenuItem onClick={onClick}>
      {icon}
      <StyledText>{children}</StyledText>
    </StyledMenuItem>
  )
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ contextMenuOpts: { isActive, position }, children }) => {
  const { contextMenuContainerRef } = useOverlayManager()
  return (
    <Portal containerRef={contextMenuContainerRef}>
      <CSSTransition in={isActive} timeout={150} classNames="menu" unmountOnExit>
        <StyledContainer position={position}>{children}</StyledContainer>
      </CSSTransition>
    </Portal>
  )
}
