import styled from '@emotion/styled'

import { Icon, Searchbar } from '@/shared/components'
import { breakpoints, colors, sizes, zIndex } from '@/shared/theme'
import { ReactComponent as UnstyledShortLogo } from '@/assets/logo.svg'
import { ReactComponent as UnstyledFullLogo } from '@/assets/full-logo.svg'
import { Link } from '@reach/router'

type NavbarStyleProps = {
  hasFocus: boolean
}

export const StyledSearchbar = styled(Searchbar)`
  transition: max-width 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  will-change: max-width;
`
export const NAVBAR_HEIGHT = 80
export const Header = styled.header<NavbarStyleProps>`
  position: sticky;
  top: 0;
  z-index: ${zIndex.header};
  min-height: ${NAVBAR_HEIGHT}px;
  max-height: ${NAVBAR_HEIGHT}px;
  display: grid;
  width: 100%;

  grid-template-columns: 1fr 2fr;

  padding: ${sizes(2)} ${sizes(3)};
  @media screen and (min-width: ${breakpoints.small}) {
    padding: ${sizes(3)} ${sizes(3)};
  }
  background-color: ${(props) => (props.hasFocus ? colors.gray[900] : colors.black)};
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);

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
  display: flex;
  align-items: center;
  margin-right: ${sizes(3)};
`

export const SearchbarContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  justify-self: end;

  width: 100%;
  max-width: 1156px;
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
