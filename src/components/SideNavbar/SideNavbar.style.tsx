import styled from '@emotion/styled'
import { breakpoints, colors, sizes, transitions, typography, zIndex } from '../../shared/theme'
import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as UnstyledFullLogo } from '@/assets/full-logo.svg'

export const SIDENAVBAR_WIDTH = 72
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
} & ExpandableElementProps

export const SidebarNav = styled.nav<ExpandableElementProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: ${zIndex.header};
  width: ${({ expanded }) => (expanded ? EXPANDED_SIDENAVBAR_WIDTH : 0)}px;
  transition: width ${transitions.timings.regular} ${transitions.easing};

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  overflow: hidden;
  color: ${colors.white};
  background-color: ${colors.gray[700]};
  @media screen and (min-width: ${breakpoints.medium}) {
    left: 0;
    width: ${({ expanded }) => (expanded ? EXPANDED_SIDENAVBAR_WIDTH : SIDENAVBAR_WIDTH)}px;
  }
`

export const LogoLink = styled(Link)`
  margin-top: 24px;
  margin-left: 80px;
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: 86px;
  }
`

export const Logo = styled(UnstyledFullLogo)`
  height: ${sizes(8)};
`

export const SidebarNavList = styled.ul`
  margin-top: 56px;
  list-style: none;
  width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  padding: 0;
`

export const SidebarNavItem = styled.li`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const SidebarNavLink = styled(Link)<SidebarNavLinkProps>`
  padding: ${sizes(5)} ${NAVBAR_LEFT_PADDING}px;
  color: ${colors.white};
  text-decoration: none;
  display: flex;
  position: relative;
  align-items: center;
  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }
  &:focus {
    background-color: rgba(0, 0, 0, 0.24);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.4);
  }
  > svg {
    @media screen and (min-width: ${breakpoints.medium}) {
      transform: translateY(${({ expanded }) => (expanded ? 0 : -8)}px);
      transition: transform ${transitions.timings.regular} ${transitions.easing};
    }
  }
  > span {
    margin-left: ${sizes(8)};
    font-weight: bold;
    font-family: ${typography.fonts.headers};
    font-size: ${typography.sizes.h5};
    line-height: 1;
  }
  &[data-active='true'] {
    background-color: rgba(0, 0, 0, 0.24);
  }
  :after {
    @media screen and (min-width: ${breakpoints.medium}) {
      content: ${({ content }) => `'${content}'`};
      position: absolute;
      font-size: 12px;
      color: white;
      transition: opacity ${transitions.timings.regular} ${transitions.easing};
      opacity: ${({ expanded }) => (expanded ? 0 : 1)};
      left: ${SIDENAVBAR_WIDTH / 2}px;
      transform: translateX(-50%);
      bottom: 0;
      margin-bottom: 10px;
    }
  }
`

export const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.header};
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
