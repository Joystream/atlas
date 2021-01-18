import React, { useState } from 'react'
import { LinkGetProps } from '@reach/router'
import useResizeObserver from 'use-resize-observer'
import HamburgerButton from '../HamburgerButton'
import { IconType } from '../../icons/index'
import {
  InactiveIcon,
  ActiveIcon,
  SidebarNav,
  SidebarNavList,
  SidebarNavItem,
  SidebarNavLink,
  DrawerOverlay,
  SubItem,
  SubItemsWrapper,
} from './Sidenav.style'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'

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
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <DrawerOverlay onClick={() => setExpanded(false)} expanded={expanded} />
      </CSSTransition>
      <HamburgerButton active={expanded} onClick={() => setExpanded(!expanded)} />
      <SidebarNav expanded={expanded}>
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

  return (
    <SidebarNavItem>
      <SidebarNavLink onClick={onClick} to={to} getProps={isActive}>
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

const isActive = ({ isCurrent }: LinkGetProps) => {
  return isCurrent ? { 'data-active': 'true' } : {}
}

export { Sidenav as default, NavItem }
export type { NavItemType }
