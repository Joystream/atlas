import React, { useState } from 'react'
import { useMatch } from 'react-router-dom'
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
  StudioText,
} from './Sidenav.style'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { Button } from '@/shared/components'
import Icon, { IconType } from '@/shared/components/Icon'
import FollowedChannels from './FollowedChannels'
import { usePersonalData } from '@/hooks'
import HamburgerButton from '@/shared/components/HamburgerButton'
import { absoluteRoutes } from '@/config/routes'
import { BadgeType } from '@/shared/components/Tabs/Tabs'

type NavSubitem = {
  name: string
  expandedName?: string
}
type NavItemType = {
  subitems?: NavSubitem[]
  icon: IconType
  to: string
} & NavSubitem

export type SidenavProps = {
  items: NavItemType[]
  isStudio?: boolean
  badges?: BadgeType[]
}

const Sidenav: React.FC<SidenavProps> = ({ items, isStudio, badges }) => {
  const {
    state: { followedChannels },
  } = usePersonalData()
  const [expanded, setExpanded] = useState(false)

  const handleNewVideoOpen = () => {
    // TODO add logic for opening new video view
    setExpanded(false)
  }

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
      <SidebarNav expanded={expanded} isStudio={isStudio}>
        <LogoLink to="/" onClick={closeSideNav} tabIndex={expanded ? 0 : -1}>
          <Logo />
          {isStudio && <StudioText>studio</StudioText>}
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
              isStudio={isStudio}
              badge={badges?.find((badge) => badge.name === item.name)}
            >
              <Icon name={item.icon} />
              <span>{item.expandedName || item.name}</span>
            </NavItem>
          ))}
        </SidebarNavList>
        {!isStudio && followedChannels.length > 0 && (
          <FollowedChannels onClick={closeSideNav} followedChannels={followedChannels} expanded={expanded} />
        )}

        <CSSTransition
          in={expanded}
          unmountOnExit
          timeout={parseInt(transitions.timings.loading)}
          classNames={transitions.names.fade}
        >
          <ButtonGroup>
            <Button
              variant="secondary"
              onClick={closeSideNav}
              icon="external"
              to={isStudio ? absoluteRoutes.viewer.index() : absoluteRoutes.studio.index()}
            >
              Joystream {!isStudio && 'studio'}
            </Button>
            <Button icon="add-video" onClick={handleNewVideoOpen}>
              New Video
            </Button>
          </ButtonGroup>
        </CSSTransition>
      </SidebarNav>
    </>
  )
}

type NavItemProps = {
  subitems?: NavSubitem[]
  expanded: boolean
  to: string
  itemName: string
  isStudio?: boolean
  badge?: BadgeType
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

const NavItem: React.FC<NavItemProps> = ({
  expanded = false,
  subitems,
  children,
  to,
  onClick,
  itemName,
  isStudio,
  badge,
}) => {
  const { height: subitemsHeight, ref: subitemsRef } = useResizeObserver<HTMLUListElement>()
  const match = useMatch(to)
  return (
    <SidebarNavItem data-badge={badge?.name === itemName ? badge.number : 0} expanded={expanded}>
      <SidebarNavLink
        onClick={onClick}
        data-active={match ? 'true' : ''}
        to={to}
        expanded={expanded || undefined}
        content={itemName}
        isStudio={isStudio}
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

export { Sidenav as default, NavItem }
export type { NavItemType }
