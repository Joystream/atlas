import React from 'react'
import { Portal } from '@/components'
import { useOverlayManager } from '@/hooks'
import { StyledContainer, StyledMenuItem, StyledIcon, StyledText } from './ContextMenu.style'
import * as Icons from '../../icons'

type MenuItemProps = {
  iconName: Icons.IconType
  onClick: () => void
}

type ContextMenuProps = {
  contextMenuOpts: {
    isActive?: boolean
    position: { x: number; y: number; left: boolean }
  }
}

export const ContextMenuItem: React.FC<MenuItemProps> = ({ iconName, children, onClick }) => {
  return (
    <StyledMenuItem onClick={onClick}>
      <StyledIcon name={iconName} />
      <StyledText>{children}</StyledText>
    </StyledMenuItem>
  )
}

const ContextMenu: React.FC<ContextMenuProps> = ({ contextMenuOpts: { isActive, position }, children }) => {
  const { contextMenuContainerRef } = useOverlayManager()
  return (
    <Portal containerRef={contextMenuContainerRef}>
      <StyledContainer isActive={isActive} position={position}>
        {children}
      </StyledContainer>
    </Portal>
  )
}

export default ContextMenu
