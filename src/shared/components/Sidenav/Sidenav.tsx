import React, { useState } from 'react'
import { useSpring, useTransition } from 'react-spring'
import useResizeObserver from 'use-resize-observer'
import HamburgerButton from '../HamburgerButton'
import {
  EXPANDED_SIDENAV_WIDTH,
  SIDENAV_WIDTH,
  SidebarNav,
  SidebarNavList,
  SidebarNavItem,
  SidebarNavLink,
  Drawer,
  SubItem,
  SubItemsWrapper,
} from './Sidenav.style'

type NavSubitem = {
  name: string
}

type NavItem = {
  subitems?: NavSubitem[]
  icon: React.ReactNode
  to: string
} & NavSubitem

type SidenavProps = {
  items: NavItem[]
}

const Sidenav: React.FC<SidenavProps> = ({ items }) => {
  const [expanded, setExpanded] = useState(false)

  const containerAnimationStyles = useSpring({
    from: { width: SIDENAV_WIDTH },
    width: expanded ? EXPANDED_SIDENAV_WIDTH : SIDENAV_WIDTH,
  })
  const overlayTransitions = useTransition(expanded, null, {
    from: { opacity: 0, display: 'none' },
    enter: { opacity: 1, display: 'block' },
    leave: { opacity: 0 },
  })

  return (
    <>
      <SidebarNav style={containerAnimationStyles}>
        <HamburgerButton active={expanded} onClick={() => setExpanded(!expanded)} />
        <SidebarNavList>
          {items.map((item) => (
            <NavItem key={item.name} to={item.to} expanded={expanded} subitems={item.subitems}>
              {item.icon}
              <span>{item.name}</span>
            </NavItem>
          ))}
        </SidebarNavList>
      </SidebarNav>
      {overlayTransitions.map(
        ({ item, key, props }) =>
          item && <Drawer key={key} style={props} onClick={() => setExpanded(false)} expanded={expanded} />
      )}
    </>
  )
}

type NavItemProps = {
  subitems?: NavSubitem[]
  expanded: boolean
  to: string
}

const NavItem: React.FC<NavItemProps> = ({ expanded, subitems, children, to }) => {
  const { height: subitemsHeight, ref: subitemsRef } = useResizeObserver<HTMLUListElement>()
  const subitemsAnimationStyles = useSpring({ height: expanded ? subitemsHeight || 0 : 0 })

  return (
    <SidebarNavItem>
      <SidebarNavLink to={to}>{children}</SidebarNavLink>
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

export { Sidenav as default, NavItem }
