import styled from '@emotion/styled'

import { Searchbar } from '@/shared/components'
import { breakpoints, colors, sizes, transitions, zIndex } from '@/shared/theme'
import { ReactComponent as UnstyledShortLogo } from '@/assets/logo.svg'
import { ReactComponent as UnstyledFullLogo } from '@/assets/full-logo.svg'
import { Link } from 'react-router-dom'
import { SIDENAVBAR_WIDTH } from '@/components/SideNavbar'

type TopNavbarStyleProps = {
  hasFocus: boolean
}

export const StyledSearchbar = styled(Searchbar)`
  transition: max-width ${transitions.timings.regular} ${transitions.easing};
  will-change: max-width;
  height: 42px;
  @media screen and (min-width: ${breakpoints.small}) {
    height: initial;
  }
`
export const TOP_NAVBAR_HEIGHT = 81
export const Header = styled.header<TopNavbarStyleProps>`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: ${zIndex.header};
  min-height: ${TOP_NAVBAR_HEIGHT}px;
  max-height: ${TOP_NAVBAR_HEIGHT}px;

  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid ${colors.gray[800]};

  background-color: ${(props) => (props.hasFocus ? colors.gray[900] : colors.black)};
  transition: all 0.4s ${transitions.easing};
  padding: ${sizes(3)} ${sizes(3)};

  @media screen and (min-width: ${breakpoints.small}) {
    z-index: ${zIndex.header};
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    column-gap: ${sizes(2)};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: ${SIDENAVBAR_WIDTH}px;
    width: calc(100% - ${SIDENAVBAR_WIDTH}px);
  }

  ${StyledSearchbar} {
    width: 100%;
    max-width: ${(props) => (props.hasFocus ? '100%' : '385px')};
  }
`

export const LogoLink = styled(Link)`
  padding: 0 ${sizes(5)};
  margin-right: ${sizes(1)};
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-right: ${sizes(5)};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    padding: 0;
    margin-left: 2px;
  }
`

export const ShortLogo = styled(UnstyledShortLogo)`
  display: block;
  height: ${sizes(8)};
  @media screen and (min-width: ${breakpoints.medium}) {
    display: none;
  }
`

export const FullLogo = styled(UnstyledFullLogo)`
  display: none;
  height: ${sizes(8)};
  @media screen and (min-width: ${breakpoints.medium}) {
    display: block;
  }
`

export const NavigationContainer = styled.div`
  margin-left: ${sizes(10)};
  margin-top: ${sizes(1)};
  display: none;
  align-items: flex-start;
  @media screen and (min-width: ${breakpoints.small}) {
    align-items: center;
    display: flex;
    margin: 0 ${sizes(3)} 0 ${sizes(12)};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: 0;
  }
`

export const SearchbarContainer = styled.div`
  max-width: 1156px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: ${sizes(14)};

  @media screen and (min-width: ${breakpoints.small}) {
    margin: 0;
  }
`
