import isPropValid from '@emotion/is-prop-valid'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link, LinkProps } from 'react-router-dom'

import { smallBadgeStyles } from '@/components/Badge'
import { NAVBAR_LEFT_PADDING } from '@/components/_navigation/SidenavBase/SidenavBase.styles'
import { cVar, media, sizes, transitions } from '@/styles'

type ExpandableElementProps = {
  expanded?: boolean
}

export type SubItemProps = {
  subitemsHeight?: number
} & ExpandableElementProps

type SidebarNavLinkProps = {
  content: string
} & ExpandableElementProps &
  LinkProps

type IsSecondary = {
  isSecondary: boolean
}

const smallPaddingCss = css`
  padding: ${sizes(3)} ${NAVBAR_LEFT_PADDING}px;
`

const bigPaddingCss = css`
  padding: ${sizes(5)} ${NAVBAR_LEFT_PADDING}px;
`

export const SidebarNavLink = styled(Link, { shouldForwardProp: isPropValid })<SidebarNavLinkProps & IsSecondary>`
  ${({ isSecondary }) => (isSecondary ? smallPaddingCss : bigPaddingCss)}

  color: ${cVar('colorText')};
  text-decoration: none;
  display: flex;
  position: relative;
  align-items: center;

  > svg path {
    fill: ${cVar('colorText')};
  }

  > svg {
    ${media.md} {
      transform: translateY(${({ expanded }) => (expanded ? 0 : -8)}px);
      transition: transform ${transitions.timings.regular} ${transitions.easing};
    }
  }

  > span {
    margin-left: ${sizes(7)};
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
    color: ${cVar('colorTextStrong')} !important;
    background-color: ${cVar('colorBackgroundAlpha')};

    > svg path {
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

    > svg path {
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
