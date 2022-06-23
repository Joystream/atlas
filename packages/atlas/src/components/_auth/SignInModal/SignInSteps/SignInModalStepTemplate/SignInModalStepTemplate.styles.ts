import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgJoystreamLogoShort } from '@/components/_illustrations'
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

export const StyledJoystreamLogo = styled(SvgJoystreamLogoShort)`
  height: 36px;
  width: auto;

  > path {
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

type AnimatedContainerProps = {
  hasNavigatedBack: boolean
}
export const AnimatedContainer = styled.div<AnimatedContainerProps>`
  display: grid;
  animation: ${({ hasNavigatedBack }) => (hasNavigatedBack ? backAnimation : forwardAnimation)}
    ${cVar('animationTransitionMedium')};
`
