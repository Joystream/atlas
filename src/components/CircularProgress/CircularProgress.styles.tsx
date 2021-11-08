import styled from '@emotion/styled'

import { colors } from '@/theme'

export type TrailVariant = 'default' | 'player'

type TrailProps = {
  variant?: TrailVariant
}

const getStrokeColor = (variant?: TrailVariant) => {
  switch (variant) {
    case 'default':
      return colors.gray[500]
    case 'player':
      return colors.transparentWhite[32]
    default:
      return colors.gray[500]
  }
}

export const SVG = styled.svg`
  fill: none;

  /* needed when parent container has display: flex */
  width: 100%;
`
export const Trail = styled.path<TrailProps>`
  stroke: ${({ variant }) => getStrokeColor(variant)};
`
export const StyledPath = styled.path`
  stroke: ${colors.blue[500]};
  transition: stroke-dashoffset 0.5s ease 0s;
`
export const Background = styled.circle`
  fill: ${colors.gray[800]};
`
