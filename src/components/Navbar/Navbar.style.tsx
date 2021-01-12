import styled from '@emotion/styled'

import { Icon, Searchbar, Button } from '@/shared/components'
import { breakpoints, colors, sizes, transitions, zIndex } from '@/shared/theme'
import { ReactComponent as UnstyledShortLogo } from '@/assets/logo.svg'
import { ReactComponent as UnstyledFullLogo } from '@/assets/full-logo.svg'
import { Link } from '@reach/router'

type NavbarStyleProps = {
  hasFocus: boolean
}

export const StyledSearchbar = styled(Searchbar)`
  transition: max-width ${transitions.timings.regular} ${transitions.easing};
  will-change: max-width;
`
export const NAVBAR_HEIGHT = 81
export const Header = styled.header<NavbarStyleProps>`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: ${zIndex.header};
  min-height: ${NAVBAR_HEIGHT}px;
  max-height: ${NAVBAR_HEIGHT}px;

  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid ${colors.gray[800]};

  background-color: ${(props) => (props.hasFocus ? colors.gray[900] : colors.black)};
  transition: all 0.4s ${transitions.easing};
  padding: ${sizes(2)} ${sizes(3)};

  @media screen and (min-width: ${breakpoints.small}) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: ${sizes(3)} ${sizes(3)};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: ${sizes(14)};
    width: calc(100% - ${sizes(14)});
  }

  ${StyledSearchbar} {
    width: 100%;
    max-width: ${(props) => (props.hasFocus ? '100%' : '385px')};
  }
`

export const LogoLink = styled(Link)`
  padding: 0 ${sizes(5)};
  margin-right: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-right: ${sizes(5)};
  }
`

export const ShortLogo = styled(UnstyledShortLogo)`
  display: block;
  height: ${sizes(9)};
  @media screen and (min-width: ${breakpoints.medium}) {
    display: none;
  }
`

export const FullLogo = styled(UnstyledFullLogo)`
  display: none;
  height: ${sizes(9)};
  @media screen and (min-width: ${breakpoints.medium}) {
    display: block;
  }
`

export const NavigationContainer = styled.div`
  margin-left: ${sizes(10)};
  margin-top: ${sizes(1)};
  display: flex;
  @media screen and (min-width: ${breakpoints.small}) {
    align-items: center;
    margin: 0 ${sizes(3)} 0 ${sizes(12)};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: 0;
  }
`

export const SearchbarContainer = styled.div`
  display: none;

  justify-self: end;

  width: 100%;
  max-width: 1156px;
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
export const ActiveIcon = styled(Icon)`
  display: none;
  color: ${colors.gray[300]};
`

export const InactiveIcon = styled(Icon)`
  display: block;
`

export const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${colors.gray[300]};
  font-weight: 500;

  text-decoration: none;

  span {
    display: none;
    margin-left: ${sizes(3)};
  }
  @media screen and (min-width: ${breakpoints.small}) {
    span {
      display: inline-block;
    }
  }

  &[data-active='true'] {
    ${ActiveIcon} {
      display: block;
      color: ${colors.gray[100]};
    }
    ${InactiveIcon} {
      display: none;
    }
    color: ${colors.gray[100]};
  }

  &:hover {
    ${ActiveIcon} {
      display: block;
      color: ${colors.white};
    }
    ${InactiveIcon} {
      display: none;
    }
    color: ${colors.white};
  }

  & + & {
    margin-left: ${sizes(3)};
    @media screen and (min-width: ${breakpoints.small}) {
      margin-left: ${sizes(6)};
    }
  }
`
export const LoginButtonsContainer = styled.div`
  display: block;
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`

export const LoginButton = styled(Button)`
  display: none;
  @media screen and (min-width: ${breakpoints.small}) {
    cursor: pointer;
    padding: 14px 20px;
    display: block;
  }
`

export const PlaylistButton = styled.button`
  cursor: pointer;
  display: flex;
  border: none;
  justify-content: center;
  align-items: center;
  color: ${colors.white};
  background: ${colors.gray[800]};
  padding: ${sizes(4)};
  @media screen and (min-width: ${breakpoints.small}) {
    margin-left: ${sizes(3)};
    padding: 17px 14px;
  }
`
