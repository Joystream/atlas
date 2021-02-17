import theme from '@/shared/theme'
import styled from '@emotion/styled'
import { Path } from './Path'

export const SVG = styled.svg`
  /* needed when parent container has display: flex */
  width: 100%;
`
export const Trail = styled(Path)`
  stroke: ${theme.colors.gray[700]};
`
export const StyledPath = styled(Path)`
  stroke: ${theme.colors.blue[500]};
  transition: stroke-dashoffset 0.5s ease 0s;
`
export const Background = styled.circle`
  fill: ${theme.colors.gray[800]};
`
