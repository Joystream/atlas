import styled from '@emotion/styled'
import Icon from '@/shared/components/Icon'
import { breakpoints, colors, sizes, transitions, typography, zIndex } from '../../theme'
import { Link } from '@reach/router'

export const SIDENAV_WIDTH = 56
export const EXPANDED_SIDENAV_WIDTH = 360

type ExpandableElementProps = {
  expanded: boolean
}

type SubItemProps = {
  subitemsHeight?: number
} & ExpandableElementProps

export const SidebarNav = styled.nav<ExpandableElementProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: ${zIndex.header};
  width: ${({ expanded }) => (expanded ? EXPANDED_SIDENAV_WIDTH : 0)}px;
  transition: width ${transitions.timings.regular} ${transitions.easing};

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  overflow: hidden;
  color: ${colors.white};
  background-color: ${colors.blue[700]};
  @media screen and (min-width: ${breakpoints.medium}) {
    left: 0;
    width: ${({ expanded }) => (expanded ? EXPANDED_SIDENAV_WIDTH : SIDENAV_WIDTH)}px;
  }
`

export const SidebarNavList = styled.ul`
  list-style: none;
  margin-top: 90px;
  padding: 0;
  padding: ${sizes(8)} ${sizes(4)};
`

export const SidebarNavItem = styled.li`
  &:not(:first-child) {
    margin-top: ${sizes(10)};
  }
  display: flex;
  flex-direction: column;
`

export const ActiveIcon = styled(Icon)`
  display: none;
`
export const InactiveIcon = styled(Icon)`
  display: block;
`

export const SidebarNavLink = styled(Link)`
  color: ${colors.white};
  text-decoration: none;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.7;
  }
  > span {
    margin-left: ${sizes(8)};
    font-weight: bold;
    font-family: ${typography.fonts.headers};
    font-size: ${typography.sizes.h5};
    line-height: 1;
  }
  &[data-active='true'] {
    ${ActiveIcon} {
      display: block;
    }
    ${InactiveIcon} {
      display: none;
    }
  }
`

export const DrawerOverlay = styled.div<ExpandableElementProps>`
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
