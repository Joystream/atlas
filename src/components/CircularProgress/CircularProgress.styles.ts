import styled from '@emotion/styled'

import { oldColors } from '@/styles'

export type TrailVariant = 'default' | 'player'

type TrailProps = {
  variant?: TrailVariant
}

const getStrokeColor = (variant?: TrailVariant) => {
  switch (variant) {
    case 'default':
      return oldColors.gray[500]
    case 'player':
      return oldColors.transparentWhite[32]
    default:
      return oldColors.gray[500]
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
  stroke: ${oldColors.blue[500]};
  transition: stroke-dashoffset 0.5s ease 0s;
`
export const Background = styled.circle`
  fill: ${oldColors.gray[800]};
`
