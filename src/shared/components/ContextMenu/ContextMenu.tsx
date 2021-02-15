import React from 'react'
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

export const MenuItem: React.FC<MenuItemProps> = ({ iconName, children, onClick }) => {
  return (
    <StyledMenuItem onClick={onClick}>
      <StyledIcon name={iconName} />
      <StyledText>{children}</StyledText>
    </StyledMenuItem>
  )
}

const ContextMenu: React.FC<ContextMenuProps> = ({ contextMenuOpts: { isActive, position }, children }) => {
  return (
    <StyledContainer isActive={isActive} position={position}>
      {children}
    </StyledContainer>
  )
}

export default ContextMenu
