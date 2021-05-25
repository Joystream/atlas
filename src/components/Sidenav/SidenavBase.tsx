import React, { ReactNode } from 'react'
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
  LegalLink,
  SidebarNavFooter,
  StudioText,
  LegalLinksWrapper,
} from './SidenavBase.style'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import HamburgerButton from '@/shared/components/HamburgerButton'
import { absoluteRoutes } from '@/config/routes'

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
  isStudio?: boolean
  additionalContent?: React.ReactNode
  buttonsContent?: React.ReactNode
  expanded: boolean
  toggleSideNav: (value: boolean) => void
}

const SidenavBase: React.FC<SidenavProps> = ({
  expanded,
  items,
  isStudio,
  additionalContent,
  buttonsContent,
  toggleSideNav,
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
      <SidebarNav expanded={expanded} isStudio={isStudio}>
        <LogoLink to="./" onClick={() => toggleSideNav(false)} tabIndex={expanded ? 0 : -1}>
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
              <LegalLink to={absoluteRoutes.legal.termsOfService()}>Terms of Service</LegalLink>
              <span>•</span>
              <LegalLink to={absoluteRoutes.legal.copyright()}>Copyright Policy</LegalLink>
            </LegalLinksWrapper>
          </SidebarNavFooter>
        </CSSTransition>
      </SidebarNav>
      <HamburgerButton active={expanded} onClick={() => toggleSideNav(!expanded)} />
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

export { SidenavBase as default, NavItem }
export type { NavItemType }
