import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { HamburgerButton } from '@/components/_buttons/HamburgerButton'
import { SubItemProps } from '@/components/_navigation/NavItem/NavItem.styles'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

type ExpandableElementProps = {
  expanded?: boolean
}

export const EXPANDED_SIDENAVBAR_WIDTH = 360
export const EXPANDED_SIDENAVBAR_WIDTH_XXS = 320
export const NAVBAR_LEFT_PADDING = 24

export const SidebarNav = styled.nav<ExpandableElementProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100%;
  z-index: ${zIndex.sideNav};
  width: ${({ expanded }) => (expanded ? `${EXPANDED_SIDENAVBAR_WIDTH_XXS}px` : 'var(--size-sidenav-width-collapsed)')};
  ${media.md} {
    width: ${({ expanded }) => (expanded ? `${EXPANDED_SIDENAVBAR_WIDTH}px` : 'var(--size-sidenav-width-collapsed)')};
  }

  transition: width ${transitions.timings.regular} ${transitions.easing};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: ${cVar('colorText')};
  background-color: ${cVar('colorBackground')};
`

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  height: var(--size-topbar-height);
  margin-left: 80px;
  text-decoration: none;
  overflow-x: hidden;
  min-width: ${EXPANDED_SIDENAVBAR_WIDTH_XXS}px;
  ${media.md} {
    min-width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  }

  flex-shrink: 0;
`

export const SidebarNavList = styled.ul`
  margin-top: 28px;
  list-style: none;
  width: ${EXPANDED_SIDENAVBAR_WIDTH_XXS}px;
  ${media.md} {
    width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  }

  padding: 0;
`

export const SidebarNavFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${NAVBAR_LEFT_PADDING}px;
  border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
  min-width: ${EXPANDED_SIDENAVBAR_WIDTH_XXS}px;
  ${media.md} {
    min-width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: ${sizes(6)};

  > * + * {
    margin-top: ${sizes(4)};
  }
`
export const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.sideNav};
  background-color: rgba(0 0 0 / 0.5);
`

export const LegalLinksWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-top: ${sizes(6)};
  padding: ${sizes(6)} 0;
  border-top: 1px solid ${cVar('colorBorderMuted')};
  color: ${cVar('colorTextMuted')} !important;

  > * + * {
    margin-left: ${sizes(2)};
  }
`

export const LegalLink = styled(Link)`
  text-decoration: none;
  color: ${cVar('colorTextMuted')} !important;

  &:hover {
    color: ${cVar('colorTextMuted')};
  }

  &:focus {
    color: ${cVar('colorTextMuted')};
  }
`

export const StyledHamburgerButton = styled(HamburgerButton)`
  position: fixed;
  margin-left: ${sizes(3)};
  z-index: ${zIndex.sideNav};
  margin-top: ${sizes(2)};
  ${media.md} {
    margin-top: ${sizes(4)};
  }
`

export const ScrollContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 10;
`
