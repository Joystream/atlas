import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { StyledSearchbar } from '@/components/Topbar/ViewerTopbar/ViewerTopbar.style'
import { Text } from '@/shared/components/Text'
import { SvgJoystreamFullLogo, SvgJoystreamOneLetterLogo } from '@/shared/illustrations'
import { colors, media, sizes, transitions, typography, zIndex } from '@/shared/theme'

import { TopbarVariant } from './TopbarBase'

type TopNavbarStyleProps = {
  hasFocus?: boolean
}

type LogoContainerProps = {
  variant?: TopbarVariant
  isHamburgerButtonPresent?: boolean
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

  ${media.small} {
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
  display: flex;
  padding: 0 ${sizes(5)};
  margin-right: ${sizes(1)};
  text-decoration: none;
  color: ${colors.gray[300]};

  ${media.medium} {
    padding: 0;
    padding-left: calc(var(--global-horizontal-padding) - ${sizes(3)});
    margin-left: 2px;
    margin-right: ${sizes(5)};
  }
`

export const StudioText = styled(Text)`
  display: none;
  font-family: ${typography.fonts.headers};
  margin-left: 6px;

  ${media.small} {
    display: block;
  }
`

export const ShortLogo = styled(SvgJoystreamOneLetterLogo)`
  display: block;
  height: ${sizes(8)};

  ${media.small} {
    display: none;
  }
`

export const FullLogo = styled(SvgJoystreamFullLogo)<LogoContainerProps>`
  display: none;
  height: ${sizes(8)};

  ${media.small} {
    display: ${({ variant }) => (variant === 'default' ? 'block' : 'flex')};
  }
`

export const LogoContainer = styled.div<LogoContainerProps>`
  margin-left: ${({ variant }) => (variant === 'default' ? sizes(10) : sizes(12))};
  ${({ isHamburgerButtonPresent }) => !isHamburgerButtonPresent && 'margin-left: 0'};

  margin-top: ${({ variant }) => (variant === 'default' ? sizes(1) : '0')};
  display: ${({ variant }) => (variant === 'default' ? 'none' : 'flex')};
  align-items: center;

  ${media.small} {
    display: flex;
    margin: 0 ${sizes(3)} 0 ${sizes(12)};
    ${({ isHamburgerButtonPresent }) => !isHamburgerButtonPresent && 'margin-left: 0'};
  }

  ${media.medium} {
    margin-left: 0;
  }
`
