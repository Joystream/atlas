import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SvgJoystreamLogoFull } from '@/assets/logos'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
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

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${sizes(6)};
`

export const StyledButton = styled(Button)`
  margin-bottom: ${sizes(6)};

  :last-of-type {
    margin-bottom: 0;
  }
`

export const SpecificComponentPlaceholer = styled.div`
  margin: ${sizes(3)} 0;

  ${media.md} {
    margin: ${sizes(4)} 0;
  }
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
    transform: scale(1.2);
  }

  ${media.lg} {
    transform: scale(1);
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
