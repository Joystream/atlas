import styled from '@emotion/styled'

import { colors } from '@/shared/theme'

import { Path } from './Path'

type TrailProps = {
  trailColor?: string
}

export const SVG = styled.svg`
  /* needed when parent container has display: flex */
  width: 100%;
`
export const Trail = styled(Path)<TrailProps>`
  stroke: ${({ trailColor = colors.gray[700] }) => trailColor};
`
export const StyledPath = styled(Path)`
  stroke: ${colors.blue[500]};
  transition: stroke-dashoffset 0.5s ease 0s;
`
export const Background = styled.circle`
  fill: ${colors.gray[800]};
`
