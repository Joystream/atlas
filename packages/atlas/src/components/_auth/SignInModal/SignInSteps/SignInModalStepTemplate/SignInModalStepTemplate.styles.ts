import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { AppLogo } from '@/components/AppLogo'
import { cVar, media, sizes } from '@/styles'

export const HeaderContainer = styled.div`
  display: inline-grid;
  grid-template-columns: max-content max-content;
  align-items: center;
  gap: ${sizes(1)};
  margin-bottom: ${sizes(2)};
`

export const LogoContainer = styled.div`
  margin: ${sizes(4)} 0 ${sizes(6)} 0;

  ${media.sm} {
    margin-top: ${sizes(6)};
  }
`

export const StyledAppLogo = styled(AppLogo)`
  height: 36px;
  width: auto;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const ContentContainer = styled.div`
  margin-top: ${sizes(6)};
`

const forwardAnimation = keyframes`
  from {
    transform: translateX(32px);
    opacity: 0;
  }
`

const backAnimation = keyframes`
  from {
    transform: translateX(-32px);
    opacity: 0;
  }
  `

type CustomBackgroundContainerProps = {
  darkBackground?: boolean
  hasDivider?: boolean
  bottomPadding?: boolean
}

export const BackgroundImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${cVar('colorBackgroundOverlay')};
  z-index: -1;
  backdrop-filter: blur(${sizes(8)});
`

export const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: -1;
`

export const CustomBackgroundContainer = styled.div<CustomBackgroundContainerProps>`
  position: relative;
  overflow: hidden;
  z-index: 0;

  /* add negative margin to allow changing background of the container */

  margin: calc(-1 * var(--local-size-dialog-padding)) calc(-1 * var(--local-size-dialog-padding)) 0
    calc(-1 * var(--local-size-dialog-padding));
  padding: ${({ bottomPadding }) =>
    bottomPadding
      ? 'var(--local-size-dialog-padding)'
      : 'var(--local-size-dialog-padding) var(--local-size-dialog-padding) 0 var(--local-size-dialog-padding)'};
  background-color: ${({ darkBackground }) => (darkBackground ? cVar('colorBackground') : 'unset')};
  box-shadow: ${({ hasDivider }) => (hasDivider ? cVar('effectDividersBottom') : 'unset')};
`

type AnimatedContainerProps = {
  hasNavigatedBack: boolean
}

export const AnimatedContainer = styled.div<AnimatedContainerProps>`
  display: grid;
  animation: ${({ hasNavigatedBack }) => css`
    ${hasNavigatedBack ? backAnimation : forwardAnimation} ${cVar('animationTransitionMedium')}
  `};
`
