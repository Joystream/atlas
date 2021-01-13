import React, { useState } from 'react'
import { LinkGetProps } from '@reach/router'
import { useSpring, useTransition } from 'react-spring'
import useResizeObserver from 'use-resize-observer'
import HamburgerButton from '../HamburgerButton'
import { IconType } from '../../icons/index'
import { useWindowSize } from '../../../hooks/useWindowSize'
import {
  InactiveIcon,
  ActiveIcon,
  EXPANDED_SIDENAV_WIDTH,
  SIDENAV_WIDTH,
  SidebarNav,
  SidebarNavList,
  SidebarNavItem,
  SidebarNavLink,
  DrawerOverlay,
  SubItem,
  SubItemsWrapper,
} from './Sidenav.style'

type NavSubitem = {
  name: string
}
type NavItemType = {
  subitems?: NavSubitem[]
  icon: IconType
  iconFilled: IconType
  to: string
} & NavSubitem

type SidenavProps = {
  items: NavItemType[]
}

const Sidenav: React.FC<SidenavProps> = ({ items }) => {
  const { width } = useWindowSize()
  const [expanded, setExpanded] = useState(false)

  const sidenavWidth = width >= 1024 ? SIDENAV_WIDTH : 0

  const containerAnimationStyles = useSpring({
    from: { width: 0 },
    width: expanded ? EXPANDED_SIDENAV_WIDTH : sidenavWidth,
  })

  const overlayTransitions = useTransition(expanded, null, {
    from: { opacity: 0, display: 'none' },
    enter: { opacity: 1, display: 'block' },
    leave: { opacity: 0 },
  })

  return (
    <>
      <HamburgerButton active={expanded} onClick={() => setExpanded(!expanded)} />
      <SidebarNav style={containerAnimationStyles}>
        <SidebarNavList>
          {items.map((item) => (
            <NavItem
              key={item.name}
              to={item.to}
              expanded={expanded}
              subitems={item.subitems}
              onClick={() => setExpanded(false)}
            >
              <ActiveIcon name={item.iconFilled} />
              <InactiveIcon name={item.icon} />
              <span>{item.name}</span>
            </NavItem>
          ))}
        </SidebarNavList>
      </SidebarNav>
      {overlayTransitions.map(
        ({ item, key, props }) =>
          item && <DrawerOverlay key={key} style={props} onClick={() => setExpanded(false)} expanded={expanded} />
      )}
    </>
  )
}

type NavItemProps = {
  subitems?: NavSubitem[]
  expanded: boolean
  to: string
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

const NavItem: React.FC<NavItemProps> = ({ expanded, subitems, children, to, onClick }) => {
  const { height: subitemsHeight, ref: subitemsRef } = useResizeObserver<HTMLUListElement>()
  const subitemsAnimationStyles = useSpring({ height: expanded ? subitemsHeight || 0 : 0 })

  return (
    <SidebarNavItem>
      <SidebarNavLink onClick={onClick} to={to} getProps={isActive}>
        {children}
      </SidebarNavLink>
      {subitems && (
        <SubItemsWrapper style={subitemsAnimationStyles}>
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

const isActive = ({ isCurrent }: LinkGetProps) => {
  return isCurrent ? { 'data-active': 'true' } : {}
}

export { Sidenav as default, NavItem }
export type { NavItemType }
