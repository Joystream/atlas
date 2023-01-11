import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SvgActionChevronR } from '@/assets/icons'
import { SvgSigninIllustration } from '@/assets/illustrations'
import { SvgJoystreamLogoFull } from '@/assets/logos'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Step } from '@/components/Step'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes } from '@/styles'

const XXS_IMAGE_WIDTH = 360
const XXS_IMAGE_HEIGHT = 225
const XS_IMAGE_WIDTH = 480
const XS_IMAGE_HEIGHT = 300
const SM_IMAGE_WIDTH = 720
const SM_IMAGE_HEIGHT = 450

export const LEFT_ANIMATION_MD = 'left-animation-md'

export const OverflowHiddenContainer = styled.div`
  margin: 0 calc(-1 * var(--size-global-horizontal-padding)) 0;
  overflow: hidden;

  [data-aos=${LEFT_ANIMATION_MD}] {
    opacity: 0;
    transform: translateX(0);
    transition-property: transform, opacity;

    &.aos-animate {
      opacity: 1;
      transform: translateX(117px);
    }
  }
`

export const StyledContainer = styled.div`
  max-width: 1440px;
  padding-bottom: ${sizes(12)};
  ${media.md} {
    margin: 0 auto;
    padding: 0;
  }
`
export const ContentLayoutGrid = styled(LayoutGrid)`
  align-items: center;
  grid-row-gap: 0;
  margin: 0 ${sizes(4)};
  ${media.md} {
    margin: 0 ${sizes(8)};
  }
`

export const HeaderGridItem = styled(GridItem)`
  ${media.md} {
    margin: 0;
    padding: ${sizes(8)};
  }
  ${media.lg} {
    padding: ${sizes(8)} ${sizes(20)};
  }
`

export const ContentWrapper = styled.div`
  margin-top: ${sizes(12)};
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-self: center;
  ${media.md} {
    margin-top: unset;
  }
`

export const StyledSignInIllustrationSVG = styled(SvgSigninIllustration)`
  margin-top: 60px;
  align-self: center;
  width: 100%;
  ${media.md} {
    position: relative;
    left: -50px;
    margin-top: 0;
  }
  ${media.lg} {
    max-width: 1000px;
  }
  ${media.xxl} {
    max-width: unset;
  }
`

export const StepsContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  padding: ${sizes(1)} 0;
  align-items: center;
  margin: ${sizes(6)} 0;
  box-shadow: inset 0 1px 0 0 ${cVar('colorBorderMutedAlpha')}, inset 0 -1px 0 0 ${cVar('colorBorderMutedAlpha')};
  ${media.md} {
    margin: ${sizes(8)} 0;
    overflow: hidden;
    padding: ${sizes(3)};

    ::before,
    ::after {
      position: absolute;
      content: '';
      background: linear-gradient(90deg, #000 0%, rgb(0 0 0 / 0) 100%);
      width: 24px;
      z-index: 1;
      height: 100%;
    }

    ::before {
      left: 0;
    }

    ::after {
      transform: matrix(-1, 0, 0, 1, 0, 0);
      right: 0;
    }
  }
`

export const stepStyles = css`
  overflow: unset;
  width: unset;
`

export const LeftStep = styled(Step)`
  ${stepStyles};

  /* we're setting auto margins instead of "justify-content: center" because of this flex/grid behavior:
   https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container */

  margin-left: auto;
`
export const RightStep = styled(Step)`
  ${stepStyles};

  margin-right: auto;
`

export const StyledSvgActionChevronR = styled(SvgActionChevronR)`
  display: block;
  margin: 0 ${sizes(2)};
  flex-shrink: 0;
  ${media.md} {
    margin: 0 ${sizes(4)};
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

export const SignInButton = styled(Button)`
  margin-bottom: ${sizes(6)};
`

export const SubTitle = styled(Text)`
  display: block;
  margin-top: ${sizes(4)};
`

const linkStyles = css`
  text-decoration: none;
  color: ${cVar('colorTextMuted')};
  align-items: center;
  display: flex;

  :hover,
  :focus {
    color: ${cVar('colorText')};
  }

  :hover path,
  :focus path {
    fill: ${cVar('colorText')};
  }
`

export const LinksGroupHeaderItem = styled(GridItem)`
  align-self: end;
  justify-content: start;
  display: flex;
  flex-wrap: wrap;
  color: ${cVar('colorTextMuted')};
  grid-auto-flow: column;
  align-items: center;
  margin: ${sizes(10)} 0 ${sizes(12)};
  ${media.md} {
    margin: 0;
    padding: ${sizes(8)};
  }
  ${media.lg} {
    padding: ${sizes(8)} ${sizes(20)};
  }
`

export const StyledAnchor = styled.a`
  ${linkStyles}
`

export const StyledSvgJoystreamLogoFull = styled(SvgJoystreamLogoFull)`
  height: 16px;
  margin-left: ${sizes(2)};
  width: unset;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const StyledLink = styled(Link)`
  ${linkStyles}
`

export const ImageGridItem = styled(GridItem)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${media.md} {
    flex-direction: column-reverse;
    height: calc(100vh - 80px);
  }
`

type IllustrationWrapperProps = {
  moveToTheLeft?: boolean
  topMargin?: number
}

export const IllustrationWrapper = styled.div<IllustrationWrapperProps>`
  position: relative;
  height: ${XXS_IMAGE_HEIGHT}px;
  margin-top: ${({ topMargin }) => (topMargin ? sizes(topMargin) : 'unset')};

  ${media.xs} {
    height: ${XS_IMAGE_HEIGHT}px;
  }
  ${media.sm} {
    height: ${SM_IMAGE_HEIGHT}px;
  }
`

type StyledIllustrationProps = {
  stickToTheRightEdge?: boolean
}

export const StyledIllustration = styled.img<StyledIllustrationProps>`
  position: absolute;
  right: ${({ stickToTheRightEdge }) => (stickToTheRightEdge ? '0' : 'unset')};
  width: ${XXS_IMAGE_WIDTH}px;
  height: ${XXS_IMAGE_HEIGHT}px;
  ${media.xs} {
    height: ${XS_IMAGE_HEIGHT}px;
    width: ${XS_IMAGE_WIDTH}px;
  }
  ${media.sm} {
    height: ${SM_IMAGE_HEIGHT}px;
    width: ${SM_IMAGE_WIDTH}px;
  }
  ${media.md} {
    position: static;
  }
`

export const InlineText = styled(Text)`
  display: inline-block;
`
