import React, { ReactNode } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Portal } from '@/components'
import { useOverlayManager } from '@/hooks'

import { StyledContainer, StyledMenuItem, StyledText, menuTransitions } from './ContextMenu.style'

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

const ContextMenu: React.FC<ContextMenuProps> = ({ contextMenuOpts: { isActive, position }, children }) => {
  const { contextMenuContainerRef } = useOverlayManager()
  return (
    <Portal containerRef={contextMenuContainerRef}>
      <CSSTransition in={isActive} timeout={150} classNames="menu" css={menuTransitions} unmountOnExit>
        <StyledContainer className="menu" position={position}>
          {children}
        </StyledContainer>
      </CSSTransition>
    </Portal>
  )
}

export default ContextMenu
