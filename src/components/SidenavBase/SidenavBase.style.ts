import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { Link, LinkProps } from 'react-router-dom'

import { smallBadgeStyles } from '@/shared/components/Badge'
import { HamburgerButton } from '@/shared/components/HamburgerButton'
import { colors, media, sizes, transitions, typography, zIndex } from '@/shared/theme'

export const EXPANDED_SIDENAVBAR_WIDTH = 360
export const NAVBAR_LEFT_PADDING = 24

type ExpandableElementProps = {
  expanded?: boolean
}

type SubItemProps = {
  subitemsHeight?: number
} & ExpandableElementProps

type SidebarNavLinkProps = {
  content: string
} & ExpandableElementProps &
  LinkProps

export const SidebarNav = styled.nav<ExpandableElementProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100%;
  z-index: ${zIndex.sideNav};
  width: ${({ expanded }) => (expanded ? `${EXPANDED_SIDENAVBAR_WIDTH}px` : 'var(--size-sidenav-width-collapsed)')};
  transition: width ${transitions.timings.regular} ${transitions.easing};
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  overflow: hidden;
  color: ${colors.gray[50]};
  background-color: ${colors.gray[800]};
`

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  height: var(--size-topbar-height);
  margin-left: 80px;
  text-decoration: none;
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
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: ${sizes(3)};

  > * + * {
    margin-top: ${sizes(4)};
  }
`

export const SidebarNavItem = styled.li<ExpandableElementProps>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  ${smallBadgeStyles}

  &[data-badge]::after {
    left: ${sizes(12)};
    top: ${sizes(3)};

    ${media.md} {
      transform: translateY(${({ expanded }) => (expanded ? 0 : -8)}px);
      transition: transform ${transitions.timings.regular} ${transitions.easing};
    }
  }
`

export const SidebarNavLink = styled(Link, { shouldForwardProp: isPropValid })<SidebarNavLinkProps>`
  padding: ${sizes(5)} ${NAVBAR_LEFT_PADDING}px;
  color: ${colors.gray[50]};
  text-decoration: none;
  display: flex;
  position: relative;
  align-items: center;

  &:hover,
  &:focus {
    background-color: ${colors.transparentPrimary[18]};
  }

  &:active,
  &[data-active='true'] {
    background-color: ${colors.transparentPrimary[10]};
  }

  > svg {
    ${media.md} {
      transform: translateY(${({ expanded }) => (expanded ? 0 : -8)}px);
      transition: transform ${transitions.timings.regular} ${transitions.easing};
    }
  }

  > span {
    margin-left: ${sizes(6)};
    font-weight: bold;
    font-family: ${typography.fonts.headers};
    font-size: ${typography.sizes.h5};
    line-height: 1;
  }

  ::after {
    ${media.md} {
      content: ${({ content }) => `'${content}'`};
      position: absolute;
      font-size: 12px;
      line-height: 1;
      color: ${colors.gray[50]};
      transition: opacity ${transitions.timings.regular} ${transitions.easing};
      opacity: ${({ expanded }) => (expanded ? 0 : 1)};
      left: calc(var(--size-sidenav-width-collapsed) / 2);
      transform: translateX(-50%);
      bottom: 0;
      margin-bottom: 10px;
      font-family: ${typography.fonts.headers};
      font-weight: ${typography.weights.bold};
    }
  }
`

export const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.sideNav};
  background-color: rgba(0, 0, 0, 0.5);
`
export const SubItemsWrapper = styled.div<SubItemProps>`
  padding-left: calc(${typography.sizes.icon.xlarge} + ${sizes(8)});
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
  font-size: ${typography.sizes.body2};
  font-family: ${typography.fonts.base};
  margin-top: ${sizes(8)};

  :first-of-type {
    margin-top: ${sizes(6)};
  }
`

export const LegalLinksWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-top: ${sizes(8)};
  padding: ${sizes(4)} 0 ${sizes(6)};
  border-top: 1px solid ${colors.gray[300]};

  > * {
    color: ${colors.gray[300]};
  }

  > * + * {
    margin-left: ${sizes(2)};
  }
`

export const LegalLink = styled(Link)`
  text-decoration: none;
  font-family: ${typography.fonts.headers};
  font-size: ${typography.sizes.subtitle2};

  &:hover {
    color: ${colors.gray[400]};
  }

  &:focus {
    color: ${colors.gray[400]};
  }

  &:active {
    color: ${colors.gray[500]};
  }
`

export const StyledHamburgerButton = styled(HamburgerButton)`
  position: fixed;
  z-index: ${zIndex.sideNav};
  left: ${sizes(3)};
  top: ${sizes(2)};

  ${media.md} {
    top: ${sizes(4)};
  }
`
