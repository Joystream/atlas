import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { Link, LinkProps } from 'react-router-dom'

import { smallBadgeStyles } from '@/components/Badge'
import { HamburgerButton } from '@/components/_buttons/HamburgerButton'
import { cVar, media, oldColors, sizes, transitions, zIndex } from '@/styles'

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

export const SidebarNavItem = styled.li<ExpandableElementProps>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  ${smallBadgeStyles}

  &[data-badge]::after {
    left: ${sizes(12)};
    top: ${sizes(3)};
    color: blue;
    background-color: green;

    ${media.md} {
      transform: translateY(${({ expanded }) => (expanded ? 0 : -8)}px);
      transition: transform ${transitions.timings.regular} ${transitions.easing};
    }
  }
`

export const SidebarNavLink = styled(Link, { shouldForwardProp: isPropValid })<SidebarNavLinkProps>`
  padding: ${sizes(5)} ${NAVBAR_LEFT_PADDING}px;
  color: ${cVar('colorText')};
  text-decoration: none;
  display: flex;
  position: relative;
  align-items: center;

  > svg > path {
    fill: ${cVar('colorText')};
  }

  > svg {
    ${media.md} {
      transform: translateY(${({ expanded }) => (expanded ? 0 : -8)}px);
      transition: transform ${transitions.timings.regular} ${transitions.easing};
    }
  }

  > span {
    margin-left: ${sizes(6)};
    font: ${cVar('typographyDesktopH400')};
    letter-spacing: ${cVar('typographyDesktopH400LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH400TextTransform')};
    color: ${cVar('colorText')};
  }

  ::after {
    ${media.md} {
      content: ${({ content }) => `'${content}'`};
      position: absolute;
      color: ${cVar('colorText')};
      transition: opacity ${transitions.timings.regular} ${transitions.easing};
      opacity: ${({ expanded }) => (expanded ? 0 : 1)};
      left: calc(var(--size-sidenav-width-collapsed) / 2);
      transform: translateX(-50%);
      bottom: 0;
      margin-bottom: ${sizes(2)};
      font: ${cVar('typographyDesktopT100Strong')};
      letter-spacing: ${cVar('typographyDesktopT100StrongLetterSpacing')};
      text-transform: ${cVar('typographyDesktopT100StrongTextTransform')};
    }
  }

  &:hover,
  &:focus {
    color: ${cVar('colorTextStrong')};
    background-color: ${cVar('colorBackgroundAlpha')};

    > svg > path {
      fill: ${cVar('colorTextStrong')};
    }

    > span {
      color: ${cVar('colorTextStrong')};
    }

    ::after {
      ${media.md} {
        color: ${cVar('colorTextStrong')};
      }
    }
  }

  &:active,
  &[data-active='true'] {
    color: ${cVar('colorTextStrong')};
    background-color: ${cVar('colorBackgroundStrongAlpha')};

    > svg > path {
      fill: ${cVar('colorTextStrong')};
    }

    > span {
      color: ${cVar('colorTextStrong')};
    }

    ::after {
      ${media.md} {
        color: ${cVar('colorTextStrong')};
      }
    }
  }
`

export const SecondarySidebarNavLink = styled(SidebarNavLink)`
  font-size: ${cVar('typographyFontSizes5')};
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
  padding: ${sizes(4)} 0 ${sizes(6)};
  border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
  font: ${cVar('typographyDesktopT100')};

  > * {
    color: ${oldColors.gray[300]};
  }

  > * + * {
    margin-left: ${sizes(2)};
  }
`

export const LegalLink = styled(Link)`
  text-decoration: none;

  font: ${cVar('typographyDesktopT100')};
  letter-spacing: ${cVar('typographyDesktopT100LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT100TextTransform')};

  &:hover {
    color: ${cVar('colorTextMuted')};
  }

  &:focus {
    color: ${cVar('colorTextMuted')};
  }

  &:active {
    color: ${cVar('colorText')};
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

export const ScrollContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 10;
`
