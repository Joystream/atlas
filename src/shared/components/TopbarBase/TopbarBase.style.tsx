import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { StyledSearchbar } from '@/components/Topbar/Topbar.style'
import { breakpoints, colors, sizes, transitions, zIndex } from '@/shared/theme'
import { ReactComponent as UnstyledShortLogo } from '@/assets/logo.svg'
import { ReactComponent as UnstyledFullLogoDefault } from '@/assets/full-logo.svg'
import { ReactComponent as UnstyledFullLogoStudio } from '@/assets/full-logo-studio.svg'
import { Link } from 'react-router-dom'
import { TopbarVariant } from './TopbarBase'

type TopNavbarStyleProps = {
  hasFocus?: boolean
}

type LogoContainerProps = {
  variant?: TopbarVariant
}

export const TOP_NAVBAR_HEIGHT = 81
export const Header = styled.header<TopNavbarStyleProps>`
  position: fixed;
  top: 0;
  left: var(--sidenav-collapsed-width);
  right: 0;

  z-index: ${zIndex.header};
  min-height: ${TOP_NAVBAR_HEIGHT}px;
  max-height: ${TOP_NAVBAR_HEIGHT}px;

  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid ${colors.gray[800]};

  background-color: ${(props) => (props.hasFocus ? colors.gray[900] : colors.black)};
  transition: background-color 0.4s ${transitions.easing};

  padding: ${sizes(3)} calc(var(--scrollbar-gap-width) + ${sizes(3)}) ${sizes(3)} ${sizes(3)};

  @media screen and (min-width: ${breakpoints.small}) {
    z-index: ${zIndex.header};
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    column-gap: ${sizes(2)};
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

const fullLogoStyles = () =>
  css`
    height: ${sizes(8)};
    @media screen and (min-width: ${breakpoints.medium}) {
      display: block;
    }
  `

export const FullLogo = styled(UnstyledFullLogoDefault)`
  display: none;
  ${fullLogoStyles}
`

export const FullLogoStudio = styled(UnstyledFullLogoStudio)`
  display: block;
`

export const LogoContainer = styled.div<LogoContainerProps>`
  margin-left: ${sizes(10)};
  margin-top: ${sizes(1)};
  display: ${({ variant }) => (variant === 'default' ? 'none' : 'flex')};
  align-items: center;
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
    margin: 0 ${sizes(3)} 0 ${sizes(12)};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-left: 0;
  }
`
