import React, { useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import useResizeObserver from 'use-resize-observer'
import {
  SidebarNav,
  SidebarNavList,
  SidebarNavItem,
  SidebarNavLink,
  DrawerOverlay,
  SubItem,
  SubItemsWrapper,
  Logo,
  LogoLink,
  ButtonGroup,
  ButtonLink,
} from './SideNavbar.style'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import Icon, { IconType } from '@/shared/components/Icon'
import FollowedChannels from './FollowedChannels'
import { usePersonalData } from '@/hooks'
import HamburgerButton from '@/shared/components/HamburgerButton'
import routes from '@/config/routes'

type NavSubitem = {
  name: string
}
type NavItemType = {
  subitems?: NavSubitem[]
  icon: IconType
  to: string
} & NavSubitem

type SidenavProps = {
  items: NavItemType[]
}

const SideNavbar: React.FC<SidenavProps> = ({ items }) => {
  const isStudio = useMatch(routes.studio())

  const {
    state: { followedChannels },
  } = usePersonalData()
  const [expanded, setExpanded] = useState(false)

  const closeSideNav = () => setExpanded(false)

  return (
    <>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <DrawerOverlay onClick={closeSideNav} />
      </CSSTransition>
      <HamburgerButton active={expanded} onClick={() => setExpanded(!expanded)} />
      <SidebarNav expanded={expanded}>
        <LogoLink to="/" onClick={closeSideNav} tabIndex={expanded ? 0 : -1}>
          <Logo />
        </LogoLink>
        <SidebarNavList>
          {items.map((item) => (
            <NavItem
              key={item.name}
              to={item.to}
              expanded={expanded}
              subitems={item.subitems}
              itemName={item.name}
              onClick={closeSideNav}
            >
              <Icon name={item.icon} />
              <span>{item.name}</span>
            </NavItem>
          ))}
        </SidebarNavList>
        {followedChannels.length > 0 && (
          <FollowedChannels onClick={closeSideNav} followedChannels={followedChannels} expanded={expanded} />
        )}
        <ButtonGroup>
          <CSSTransition
            in={expanded}
            unmountOnExit
            timeout={parseInt(transitions.timings.loading)}
            classNames={transitions.names.fade}
          >
            <ButtonLink
              variant="tertiary"
              onLinkClick={closeSideNav}
              icon="external"
              asLink
              to={isStudio ? routes.index() : routes.studio()}
            >
              Joystream {!isStudio && 'studio'}
            </ButtonLink>
          </CSSTransition>
        </ButtonGroup>
      </SidebarNav>
    </>
  )
}

type NavItemProps = {
  subitems?: NavSubitem[]
  expanded: boolean
  to: string
  itemName: string
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

const NavItem: React.FC<NavItemProps> = ({ expanded = false, subitems, children, to, onClick, itemName }) => {
  const { height: subitemsHeight, ref: subitemsRef } = useResizeObserver<HTMLUListElement>()
  const match = useMatch(to)
  return (
    <SidebarNavItem>
      <SidebarNavLink
        onClick={onClick}
        data-active={match ? 'true' : ''}
        to={to}
        expanded={expanded || undefined}
        content={itemName}
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

export { SideNavbar as default, NavItem }
export type { NavItemType }
