import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { Link, LinkProps } from 'react-router-dom'

import { HamburgerButton } from '@/components/_buttons/HamburgerButton'
import { EXPANDED_SIDENAVBAR_WIDTH, NAVBAR_LEFT_PADDING, SubItemProps } from '@/components/_navigation/NavItem'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

type ExpandableElementProps = {
  expanded?: boolean
}

export const SidebarNav = styled.nav<ExpandableElementProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100%;
  z-index: ${zIndex.sideNav};
  width: ${({ expanded }) => (expanded ? `${EXPANDED_SIDENAVBAR_WIDTH}px` : 'var(--size-sidenav-width-collapsed)')};
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
  min-width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  flex-shrink: 0;
`

export const SidebarNavList = styled.ul`
  margin-top: 28px;
  list-style: none;
  width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  padding: 0;
`

export const SidebarNavFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${NAVBAR_LEFT_PADDING}px;
  border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
  min-width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
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
export const SubItemsWrapper = styled.div<SubItemProps>`
  padding-left: calc(32px + ${sizes(8)});
  transition: height ${transitions.timings.regular} ${transitions.easing};
  overflow: hidden;
  height: ${({ expanded, subitemsHeight }) => (expanded ? subitemsHeight || 0 : 0)}px;

  > ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    list-style: none;
  }
`

export const SubItem = styled.li`
  font: ${cVar('typographyDesktopT200')};
  letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200TextTransform')};
  margin-top: ${sizes(8)};

  :first-of-type {
    margin-top: ${sizes(6)};
  }
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

  font: ${cVar('typographyDesktopT100')};
  letter-spacing: ${cVar('typographyDesktopT100LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT100TextTransform')};
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
  margin-top: ${sizes(4)};
  z-index: ${zIndex.sideNav};
  ${media.xxs} {
    margin-top: ${sizes(3)};
  }
`

export const ScrollContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 10;
`
