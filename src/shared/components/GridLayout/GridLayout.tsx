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
  colStart?: number | 'initial' | ReponsivenessObject
  colSpan?: number | ReponsivenessObject
  rowStart?: number | 'initial' | ReponsivenessObject
  rowSpan?: number | ReponsivenessObject
}

function isResponsiveObject(prop?: number | 'initial' | ReponsivenessObject): prop is ReponsivenessObject {
  return !!prop && typeof prop !== 'number' && prop !== 'initial'
}

export const GridItem = styled.div<GridItemProps>`
  ${media.base} {
    ${({ colStart }) => isResponsiveObject(colStart) && `grid-column-start: ${colStart.base};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && `grid-column-end: span ${colSpan.base};`}
    ${({ rowStart }) => isResponsiveObject(rowStart) && `grid-row-start: ${rowStart.base};`}
    ${({ rowSpan }) => isResponsiveObject(rowSpan) && `grid-row-end: span ${rowSpan.base};`}
  }
  ${media.compact} {
    ${({ colStart }) => isResponsiveObject(colStart) && `grid-column-start: ${colStart.compact};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && `grid-column-end: span ${colSpan.compact};`}
    ${({ rowStart }) => isResponsiveObject(rowStart) && `grid-row-start: ${rowStart.compact};`}
    ${({ rowSpan }) => isResponsiveObject(rowSpan) && `grid-row-end: span ${rowSpan.compact};`}
  }
  ${media.small} {
    ${({ colStart }) => isResponsiveObject(colStart) && `grid-column-start: ${colStart.small};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && `grid-column-end: span ${colSpan.small};`}
    ${({ rowStart }) => isResponsiveObject(rowStart) && `grid-row-start: ${rowStart.small};`}
    ${({ rowSpan }) => isResponsiveObject(rowSpan) && `grid-row-end: span ${rowSpan.small};`}
  }
  ${media.medium} {
    ${({ colStart }) => isResponsiveObject(colStart) && `grid-column-start: ${colStart.medium};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && `grid-column-end: span ${colSpan.medium};`}
    ${({ rowStart }) => isResponsiveObject(rowStart) && `grid-row-start: ${rowStart.medium};`}
    ${({ rowSpan }) => isResponsiveObject(rowSpan) && `grid-row-end: span ${rowSpan.medium};`}
  }
  ${media.large} {
    ${({ colStart }) => isResponsiveObject(colStart) && `grid-column-start: ${colStart.large};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && `grid-column-end: span ${colSpan.large};`}
    ${({ rowStart }) => isResponsiveObject(rowStart) && `grid-row-start: ${rowStart.large};`}
    ${({ rowSpan }) => isResponsiveObject(rowSpan) && `grid-row-end: span ${rowSpan.large};`}
  }
  ${media.xlarge} {
    ${({ colStart }) => isResponsiveObject(colStart) && `grid-column-start: ${colStart.xlarge};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && `grid-column-end: span ${colSpan.xlarge};`}
    ${({ rowStart }) => isResponsiveObject(rowStart) && `grid-row-start: ${rowStart.xlarge};`}
    ${({ rowSpan }) => isResponsiveObject(rowSpan) && `grid-row-end: span ${rowSpan.xlarge};`}
  }
  ${media.xxlarge} {
    ${({ colStart }) => isResponsiveObject(colStart) && `grid-column-start: ${colStart.xxlarge};`}
    ${({ colSpan }) => isResponsiveObject(colSpan) && `grid-column-end: span ${colSpan.xxlarge};`}
    ${({ rowStart }) => isResponsiveObject(rowStart) && `grid-row-start: ${rowStart.xxlarge};`}
    ${({ rowSpan }) => isResponsiveObject(rowSpan) && `grid-row-end: span ${rowSpan.xxlarge};`}
  }
`
