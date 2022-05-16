import React, { createRef, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { NavItem, NavItemType } from '@/components/_navigation/NavItem'
import { absoluteRoutes } from '@/config/routes'
import { useOverlayManager } from '@/providers/overlayManager'
import { transitions } from '@/styles'

import {
  ButtonGroup,
  DrawerOverlay,
  LegalLink,
  LegalLinksWrapper,
  LogoLink,
  ScrollContainer,
  SidebarNav,
  SidebarNavFooter,
  SidebarNavList,
  StyledHamburgerButton,
} from './SidenavBase.styles'

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
  const scrollContainer = createRef<HTMLDivElement>()
  const scrollAndToggle = (expended: boolean) => {
    scrollContainer?.current && scrollContainer.current.scrollTo(0, 0)
    toggleSideNav(expended)
  }
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  useEffect(() => {
    if (expanded) {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [decrementOverlaysOpenCount, expanded, incrementOverlaysOpenCount])

  return (
    <>
      <CSSTransition
        in={expanded}
        unmountOnExit
        timeout={parseInt(transitions.timings.loading)}
        classNames={transitions.names.fade}
      >
        <DrawerOverlay onClick={() => scrollAndToggle(false)} />
      </CSSTransition>
      <SidebarNav expanded={expanded} className={className}>
        <LogoLink to={logoLinkUrl} onClick={() => scrollAndToggle(false)} tabIndex={expanded ? 0 : -1}>
          {logoNode}
        </LogoLink>
        <ScrollContainer ref={scrollContainer} expanded={expanded} data-scroll-lock-scrollable>
          <SidebarNavList>
            {items.map((item) => (
              <NavItem
                key={item.name}
                to={item.to}
                expanded={expanded}
                subitems={item.subitems}
                itemName={item.name}
                onClick={() => scrollAndToggle(false)}
                badgeNumber={item.badgeNumber}
                isSecondary={false}
              >
                {item.icon}
                <span>{item.expandedName || item.name}</span>
              </NavItem>
            ))}
          </SidebarNavList>
          <div>{additionalContent}</div>
        </ScrollContainer>
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
                <Text variant="t100" color="inherit">
                  Terms of Service
                </Text>
              </LegalLink>
              <span>•</span>
              <LegalLink to={absoluteRoutes.legal.copyright()} target="_blank">
                <Text variant="t100" color="inherit">
                  Copyright Policy
                </Text>
              </LegalLink>
            </LegalLinksWrapper>
          </SidebarNavFooter>
        </CSSTransition>
      </SidebarNav>
      <StyledHamburgerButton active={expanded} onClick={() => scrollAndToggle(!expanded)} />
    </>
  )
}

export { SidenavBase }
