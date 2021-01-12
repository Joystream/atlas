import styled from '@emotion/styled'
import { animated } from 'react-spring'
import { colors, sizes, typography, zIndex } from '../../theme'
import { Link } from '@reach/router'

export const SIDENAV_WIDTH = 56
export const EXPANDED_SIDENAV_WIDTH = 360

type DrawerProps = {
  expanded: boolean
}

export const SidebarNav = styled(animated.nav)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: ${zIndex.header};
  overflow: hidden;
  padding: ${sizes(8)} ${sizes(4)};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${colors.blue[700]};
  color: ${colors.white};
`

export const SidebarNavList = styled.ul`
  list-style: none;
  margin-top: 90px;
  padding: 0;
`

export const SidebarNavItem = styled.li`
  &:not(:first-child) {
    margin-top: ${sizes(10)};
  }
  display: flex;
  flex-direction: column;
`

export const SidebarNavLink = styled(Link)`
  color: ${colors.white};
  text-decoration: none;
  display: flex;
  align-items: center;
  > span {
    margin-left: ${sizes(8)};
    font-weight: bold;
    font-family: ${typography.fonts.headers};
    font-size: ${typography.sizes.h5};
    line-height: 1;
  }
`

export const Drawer = styled(animated.div)<DrawerProps>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: ${({ expanded }) => (expanded ? 'block' : 'none')};
  z-index: ${zIndex.overlay};
  background-color: rgba(0, 0, 0, 0.5);
`
export const SubItemsWrapper = styled(animated.div)`
  padding-left: calc(${typography.sizes.icon.xlarge} + ${sizes(8)});
  overflow: hidden;
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
