import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SvgActionChevronR } from '@/assets/icons'
import { SvgSigninIllustration } from '@/assets/illustrations'
import { SvgJoystreamLogoFull } from '@/assets/logos'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
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

export const StyledContainer = styled(LimitedWidthContainer)`
  overflow-x: hidden;
  padding: ${sizes(12)} var(--size-global-horizontal-padding);

  /* negative margin for the purpose of overflowing images */
  margin: 0 calc(-1 * var(--size-global-horizontal-padding)) 0;
`
export const ContentLayoutGrid = styled(LayoutGrid)`
  row-gap: ${sizes(12)};
  justify-content: center;
`

export const HeaderGridItem = styled(GridItem)`
  ${media.sm} {
    max-width: 550px;
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
  padding: ${sizes(1)} 0;
  align-items: center;
  margin: ${sizes(6)} 0;
  box-shadow: inset 0 1px 0 0 ${cVar('colorBorderMutedAlpha')}, inset 0 -1px 0 0 ${cVar('colorBorderMutedAlpha')};
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
`

export const ButtonGroup = styled.div`
  margin-top: ${sizes(12)};
  display: flex;
  flex-direction: column;
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

export const LinksGroup = styled(GridItem)`
  justify-content: start;
  display: grid;
  color: ${cVar('colorTextMuted')};
  grid-auto-flow: column;
  align-items: center;
  gap: ${sizes(2)};
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

export const ImageLayoutGrid = styled(LayoutGrid)`
  margin-top: ${sizes(12)};
`

export const IllustrationWrapper = styled.div`
  position: relative;
  height: ${XXS_IMAGE_HEIGHT}px;
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
  top: 0;
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
`
