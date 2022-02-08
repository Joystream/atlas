import React, { ReactNode } from 'react'
import { useMatch } from 'react-router-dom'
import useResizeObserver from 'use-resize-observer'

import { SidebarNav, SidebarNavItem, SidebarNavLink, SubItem, SubItemProps, SubItemsWrapper } from './NavItem.styles'

type NavSubitem = {
  name: string
  expandedName?: string
}

export type NavItemType = {
  subitems?: NavSubitem[]
  icon: ReactNode
  to: string
  badgeNumber?: number
} & NavSubitem

export type NavItemProps = {
  subitems?: NavSubitem[]
  expanded: boolean
  to: string
  itemName: string
  badgeNumber?: number
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
  isSecondary: boolean
}

export const NavItem: React.FC<NavItemProps> = ({
  expanded = false,
  subitems,
  children,
  to,
  onClick,
  itemName,
  badgeNumber,
  isSecondary,
}) => {
  const { height: subitemsHeight, ref: subitemsRef } = useResizeObserver<HTMLUListElement>()
  const match = useMatch(to)
  return (
    <SidebarNavItem data-badge={badgeNumber} expanded={expanded}>
      <SidebarNavLink
        onClick={onClick}
        data-active={match ? 'true' : ''}
        to={to}
        expanded={expanded || undefined}
        content={itemName}
        isSecondary={isSecondary}
      >
        {children}
      </SidebarNavLink>
      {subitems && (
        <SubItemsWrapper expanded={expanded} subitemsHeight={subitemsHeight}>
          <ul ref={subitemsRef}>
            {subitems.map((item) => (
              <SubItem key={item.name}>
                <a>{item.name}</a>
              </SubItem>
            ))}
          </ul>
        </SubItemsWrapper>
      )}
    </SidebarNavItem>
  )
}
