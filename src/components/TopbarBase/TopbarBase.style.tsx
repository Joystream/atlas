import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SvgJoystreamFullLogo, SvgJoystreamOneLetterLogo, SvgStudioFullLogo } from '@/shared/illustrations'
import { colors, media, sizes, zIndex } from '@/shared/theme'

import { TopbarVariant } from './TopbarBase'

const logoStyles = css`
  display: none;
  height: ${sizes(8)};

  ${media.sm} {
    display: block;
  }
`

type LogoContainerProps = {
  variant?: TopbarVariant
  isHamburgerButtonPresent?: boolean
}

export const TOP_NAVBAR_HEIGHT = 81
export const Header = styled.header`
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
  background-color: ${colors.black};
  padding: ${sizes(3)} calc(var(--scrollbar-gap-width) + ${sizes(3)}) ${sizes(3)} ${sizes(3)};

  ${media.sm} {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    column-gap: ${sizes(2)};
  }
`

export const LogoLink = styled(Link)`
  display: flex;
  padding: 0 ${sizes(5)};
  margin-right: ${sizes(1)};
  text-decoration: none;
  color: ${colors.gray[300]};

  ${media.md} {
    padding: 0;
    padding-left: calc(var(--global-horizontal-padding) - ${sizes(3)});
    margin-left: 2px;
    margin-right: ${sizes(5)};
  }
`

export const ShortLogo = styled(SvgJoystreamOneLetterLogo)`
  display: block;
  height: ${sizes(8)};

  ${media.sm} {
    display: none;
  }
`

export const JoystreamFullLogo = styled(SvgJoystreamFullLogo)`
  ${logoStyles}
`

export const StudioFullLogo = styled(SvgStudioFullLogo)`
  ${logoStyles}
`

export const LogoContainer = styled.div<LogoContainerProps>`
  margin-left: ${({ variant }) => (variant === 'default' ? sizes(10) : sizes(12))};
  ${({ isHamburgerButtonPresent }) => !isHamburgerButtonPresent && 'margin-left: 0'};

  margin-top: ${({ variant }) => (variant === 'default' ? sizes(1) : '0')};
  display: flex;
  align-items: center;

  ${media.sm} {
    margin: 0 ${sizes(3)} 0 ${sizes(12)};
    ${({ isHamburgerButtonPresent }) => !isHamburgerButtonPresent && 'margin-left: 0'};
  }

  ${media.md} {
    margin-left: 0;
  }
`
