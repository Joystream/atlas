import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { media } from '@/shared/theme'

type ReponsivenessObject = Partial<Record<keyof typeof media, number>>

export const LayoutGrid = styled.div`
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

function isResponsivenessObject(prop?: number | 'initial' | ReponsivenessObject): prop is ReponsivenessObject {
  return !!prop && typeof prop !== 'number' && prop !== 'initial'
}

const createBreakpointGridItemRules = (breakpointKey: keyof ReponsivenessObject) => ({
  colStart,
  colSpan,
  rowStart,
  rowSpan,
}: GridItemProps) => css`
  ${media[breakpointKey]} {
    ${isResponsivenessObject(colStart) && colStart[breakpointKey] && `grid-column-start: ${colStart[breakpointKey]};`}
    ${isResponsivenessObject(colSpan) && colSpan[breakpointKey] && `grid-column-end: span ${colSpan[breakpointKey]};`}
    ${isResponsivenessObject(rowStart) && rowStart[breakpointKey] && `grid-row-start: ${rowStart[breakpointKey]};`}
    ${isResponsivenessObject(rowSpan) && rowSpan[breakpointKey] && `grid-row-end: span ${rowSpan[breakpointKey]};`}
  }
`

export const GridItem = styled.div<GridItemProps>`
  ${createBreakpointGridItemRules('base')}
  ${createBreakpointGridItemRules('compact')}
  ${createBreakpointGridItemRules('small')}
  ${createBreakpointGridItemRules('medium')}
  ${createBreakpointGridItemRules('large')}
  ${createBreakpointGridItemRules('xlarge')}
  ${createBreakpointGridItemRules('xxlarge')}
`
