import { css } from '@emotion/react'
import styled from '@emotion/styled'

import topRightPattern from '@/assets/images/ypp-background-pattern-2.svg'
import bottomLeftPattern from '@/assets/images/ypp-background-pattern.svg'
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

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)<{ centerText?: boolean }>`
  text-align: ${({ centerText }) => (centerText ? 'center' : 'unset')};
  padding-bottom: unset;
`

export const CenteredLayoutGrid = styled(LayoutGrid)`
  text-align: center;
  row-gap: 0;
`

type HeaderGridItemProps = {
  marginBottom?: number
}

export const HeaderGridItem = styled(GridItem, {
  shouldForwardProp: (prop) => prop !== 'marginBottom',
})<HeaderGridItemProps>`
  margin-bottom: ${({ marginBottom = 0 }) => sizes(marginBottom)};
  align-self: center;
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
