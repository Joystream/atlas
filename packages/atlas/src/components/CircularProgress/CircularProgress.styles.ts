import styled from '@emotion/styled'

import { cVar } from '@/styles'

export type TrailVariant = 'default' | 'player'

type TrailProps = {
  variant?: TrailVariant
}

const getStrokeColor = (variant?: TrailVariant) => {
  switch (variant) {
    case 'default':
      return cVar('colorCoreNeutral500')
    case 'player':
      return cVar('colorCoreNeutral400Lighten')
    default:
      return cVar('colorCoreNeutral500')
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
  stroke: ${cVar('colorCoreBlue500')};
  transition: stroke-dashoffset 0.5s ease 0s;
`
export const Background = styled.circle`
  fill: ${cVar('colorCoreNeutral800')};
`
