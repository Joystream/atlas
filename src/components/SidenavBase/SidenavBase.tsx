import React, { ReactNode } from 'react'
import { useMatch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { absoluteRoutes } from '@/config/routes'
import { transitions } from '@/theme'

import {
  ButtonGroup,
  DrawerOverlay,
  LegalLink,
  LegalLinksWrapper,
  LogoLink,
  SidebarNav,
  SidebarNavFooter,
  SidebarNavItem,
  SidebarNavLink,
  SidebarNavList,
  StyledHamburgerButton,
  SubItem,
  SubItemsWrapper,
} from './SidenavBase.styles'

type NavSubitem = {
  name: string
  expandedName?: string
}
type NavItemType = {
  subitems?: NavSubitem[]
  icon: ReactNode
  to: string
  badgeNumber?: number
} & NavSubitem

export type SidenavProps = {
  items: NavItemType[]
  additionalContent?: React.ReactNode
  buttonsContent?: React.ReactNode
  expanded: boolean
  toggleSideNav: (value: boolean) => void
  logoNode: React.ReactNode
  logoLinkUrl: string
  className?: string
}

const SidenavBase: React.FC<SidenavProps> = ({
  expanded,
  items,
  logoNode,
  logoLinkUrl,
  additionalContent,
  buttonsContent,
  toggleSideNav,
  className,
}) => {
  return (
    <>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <DrawerOverlay onClick={() => toggleSideNav(false)} />
      </CSSTransition>
      <SidebarNav expanded={expanded} className={className}>
        <LogoLink to={logoLinkUrl} onClick={() => toggleSideNav(false)} tabIndex={expanded ? 0 : -1}>
          {logoNode}
        </LogoLink>
        <SidebarNavList>
          {items.map((item) => (
            <NavItem
              key={item.name}
              to={item.to}
              expanded={expanded}
              subitems={item.subitems}
              itemName={item.name}
              onClick={() => toggleSideNav(false)}
              badgeNumber={item.badgeNumber}
            >
              {item.icon}
              <span>{item.expandedName || item.name}</span>
            </NavItem>
          ))}
        </SidebarNavList>
        <div>{additionalContent}</div>
        <CSSTransition
          in={expanded}
          unmountOnExit
          timeout={parseInt(transitions.timings.loading)}
          classNames={transitions.names.fade}
        >
          <SidebarNavFooter>
            <ButtonGroup>{buttonsContent}</ButtonGroup>
            <LegalLinksWrapper>
              <LegalLink to={absoluteRoutes.legal.termsOfService()} target="_blank">
                Terms of Service
              </LegalLink>
              <span>•</span>
              <LegalLink to={absoluteRoutes.legal.copyright()} target="_blank">
                Copyright Policy
              </LegalLink>
            </LegalLinksWrapper>
          </SidebarNavFooter>
        </CSSTransition>
      </SidebarNav>
      <StyledHamburgerButton active={expanded} onClick={() => toggleSideNav(!expanded)} />
    </>
  )
}

type NavItemProps = {
  subitems?: NavSubitem[]
  expanded: boolean
  to: string
  itemName: string
  badgeNumber?: number
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

const NavItem: React.FC<NavItemProps> = ({
  expanded = false,
  subitems,
  children,
  to,
  onClick,
  itemName,
  badgeNumber,
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

export { SidenavBase, NavItem }
export type { NavItemType }
