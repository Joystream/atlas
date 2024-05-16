import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import topRightPattern from '@/assets/images/ypp-background-pattern-2.svg'
import bottomLeftPattern from '@/assets/images/ypp-background-pattern.svg'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { cVar, media, sizes } from '@/styles'

export const imageShadow = css`
  /* https://www.figma.com/file/oQqFqdAiPu16eeE2aA5AD5/YouTube-Partner-Program?node-id=1819%3A79839 */

  /* TODO this filter was requested by designers. Unfortunately it cause big performance issues, especially on smaller devices */

  /* Reconsider using drop-shadow or remove this css block entirely */

  /* filter: drop-shadow(0 33px 100px rgb(0 0 0 / 0.22)) drop-shadow(0 7.371px 22.3363px rgb(0 0 0 / 0.1311))
    drop-shadow(0 2.1945px 6.6501px rgb(0 0 0 / 0.0889)); */
`

export const Wrapper = styled.div`
  margin-top: -80px;

  [data-aos] {
    &[data-aos][data-aos-easing='atlas-easing'] {
      transition-timing-function: cubic-bezier(0.09, 0.43, 0.3, 0.99);
    }
  }
`

const rot = keyframes`
  0% {
    transform: rotate(60deg);
  }

  100% {
    transform: rotate(420deg);
  }
`

export const GlowContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 1px;
  animation: ${rot} 30s infinite linear;
`

export const GlowBox = styled.div<{ walkHeight: number; walkWidth: number }>`
  display: block;
  position: absolute;
  height: 2000px;
  width: 2000px;
  border-radius: 50%;
  top: ${(props) => (props.walkHeight / 1) * -1}px;
  background: radial-gradient(circle, rgb(20 52 146 / 1) 70%, transparent 100%);
  filter: blur(400px);
`
export const StyledLimitedWidthContainerHero = styled.div<{ centerText?: boolean }>`
  text-align: ${({ centerText }) => (centerText ? 'center' : 'unset')};
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  padding: ${sizes(4)};
  margin-top: ${sizes(6)};

  ${media.md} {
    margin-top: 0;
    padding: ${sizes(8)};
    border-radius: 32px;
  }
  ${media.lg} {
    padding: ${sizes(16)};
  }
`
export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)<{ centerText?: boolean }>`
  text-align: ${({ centerText }) => (centerText ? 'center' : 'unset')};
  padding-bottom: unset;
`

export const StyledLimitedWidthContainerVideo = styled(LimitedWidthContainer)<{ centerText?: boolean }>`
  text-align: ${({ centerText }) => (centerText ? 'center' : 'unset')};
  background: radial-gradient(50% 50% at 50% 50%, #15308b 0%, #000 100%);
`

export const CenteredLayoutGrid = styled(LayoutGrid)`
  text-align: center;
  row-gap: 0;
`

export const CenteredLayoutFlex = styled(FlexBox)`
  text-align: center;
  row-gap: 0;

  ${media.lg} {
    padding: 0 20%;
  }
`

export const TierCardWrapper = styled(GridItem)`
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  gap: ${sizes(4)};

  ${media.sm} {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, minmax(auto, 250px));
  }

  ${media.md} {
    gap: ${sizes(6)};
    grid-template-columns: repeat(4, minmax(auto, 250px));
  }
`

type HeaderGridItemProps = {
  marginBottom?: number
}

export const HeaderGridItem = styled(GridItem, {
  shouldForwardProp: (prop) => prop !== 'marginBottom',
})<HeaderGridItemProps>`
  margin-bottom: ${({ marginBottom = 0 }) => sizes(marginBottom)};
  align-self: center;
  text-align: center;
`

type BackgroundContainerProps = {
  noBackground?: boolean
  pattern?: 'top' | 'bottom'
}

const backgroundPattern = ({ pattern }: BackgroundContainerProps) => {
  if (!pattern) {
    return
  }
  return css`
    background-image: ${pattern === 'top' ? `url(${topRightPattern}) ` : `url(${bottomLeftPattern}) `};
    background-position: ${pattern === 'top' ? 'top right' : 'bottom left'};
    background-repeat: no-repeat;
  `
}

export const BackgroundContainer = styled.div<BackgroundContainerProps>`
  overflow: hidden;
  background-color: ${({ noBackground }) => (noBackground ? 'unset' : cVar('colorBackgroundMuted'))};
  margin-left: calc(-1 * var(--size-global-horizontal-padding));
  margin-right: calc(-1 * var(--size-global-horizontal-padding));
  padding: ${sizes(16)} var(--size-global-horizontal-padding);
  ${media.md} {
    padding: ${sizes(24)} var(--size-global-horizontal-padding);
    ${backgroundPattern};
  }
`

export const HeroBackgroundContainer = styled(BackgroundContainer)`
  padding-top: ${sizes(4)};

  ${media.md} {
    padding-top: ${sizes(8)};
    ${backgroundPattern};
  }
`
