import styled from '@emotion/styled'

import { media } from '@/shared/theme'

type ReponsivenessObject = Partial<Record<keyof typeof media, number>>

export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 16px;

  ${media.medium} {
    grid-gap: 24px;
  }
`

type GridItemProps = {
  colStart?: number | ReponsivenessObject
  colSpan?: number | ReponsivenessObject
}

function isResponsiveObject(prop?: number | ReponsivenessObject): prop is ReponsivenessObject {
  return !!prop && typeof prop !== 'number'
}

export const GridItem = styled.div<GridItemProps>`
  ${media.base} {
    ${({ colStart }) => isResponsiveObject(colStart) && colStart.base && `grid-column-start: ${colStart.base};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && colSpan.base && `grid-column-end: span ${colSpan.base};`}
  }
  ${media.compact} {
    ${({ colStart }) => isResponsiveObject(colStart) && colStart.compact && `grid-column-start: ${colStart.compact};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && colSpan.compact && `grid-column-end: span ${colSpan.compact};`}
  }
  ${media.small} {
    ${({ colStart }) => isResponsiveObject(colStart) && colStart.small && `grid-column-start: ${colStart.small};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && colSpan.small && `grid-column-end: span ${colSpan.small};`}
  }
  ${media.medium} {
    ${({ colStart }) => isResponsiveObject(colStart) && colStart.medium && `grid-column-start: ${colStart.medium};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && colSpan.medium && `grid-column-end: span ${colSpan.medium};`}
  }
  ${media.large} {
    ${({ colStart }) => isResponsiveObject(colStart) && colStart.large && `grid-column-start: ${colStart.large};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && colSpan.large && `grid-column-end: span ${colSpan.large};`}
  }
  ${media.xlarge} {
    ${({ colStart }) => isResponsiveObject(colStart) && colStart.xlarge && `grid-column-start: ${colStart.xlarge};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && colSpan.xlarge && `grid-column-end: span ${colSpan.xlarge};`}
  }
  ${media.xxlarge} {
    ${({ colStart }) => isResponsiveObject(colStart) && colStart.xxlarge && `grid-column-start: ${colStart.xxlarge};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && colSpan.xxlarge && `grid-column-end: span ${colSpan.xxlarge};`}
  }
`
