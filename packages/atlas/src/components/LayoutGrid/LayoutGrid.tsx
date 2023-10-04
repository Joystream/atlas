import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { media, sizes } from '@/styles'

type ReponsivenessObject = Partial<Record<keyof typeof media | 'base', number>>

export const LayoutGrid = styled.div<{ gap?: number }>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 16px;

  ${media.md} {
    grid-gap: 24px;
  }

  ${(props) => (props.gap ? `grid-gap: ${sizes(props.gap)}!important;` : '')}
`

export type GridItemProps = {
  colStart?: number | 'initial' | ReponsivenessObject
  colSpan?: number | ReponsivenessObject
  rowStart?: number | 'initial' | ReponsivenessObject
  rowSpan?: number | ReponsivenessObject
}

function isResponsivenessObject(prop?: number | 'initial' | ReponsivenessObject): prop is ReponsivenessObject {
  return !!prop && typeof prop !== 'number' && prop !== 'initial'
}

const createBreakpointGridItemRules =
  (breakpointKey: keyof ReponsivenessObject) =>
  ({ colStart, colSpan, rowStart, rowSpan }: GridItemProps) =>
    css`
      ${breakpointKey === 'base' ? '@media screen and (min-width: 0px)' : media[breakpointKey]} {
        ${isResponsivenessObject(colStart) &&
        colStart[breakpointKey] &&
        `grid-column-start: ${colStart[breakpointKey]};`}
        ${isResponsivenessObject(colSpan) &&
        colSpan[breakpointKey] &&
        `grid-column-end: span ${colSpan[breakpointKey]};`}
        ${isResponsivenessObject(rowStart) && rowStart[breakpointKey] && `grid-row-start: ${rowStart[breakpointKey]};`}
        ${isResponsivenessObject(rowSpan) && rowSpan[breakpointKey] && `grid-row-end: span ${rowSpan[breakpointKey]};`}
      }
    `

const filteredProps = ['colStart', 'colSpan', 'rowStart', 'rowSpan', 'as']

const gridItemStyles = ({ colSpan, rowSpan, rowStart, colStart }: GridItemProps) => css`
  min-width: 0;

  ${!isResponsivenessObject(colStart) && colStart && `grid-column-start: ${colStart};`}
  ${!isResponsivenessObject(colSpan) && colSpan && `grid-column-end: span ${colSpan};`}
  ${!isResponsivenessObject(rowStart) && rowStart && `grid-row-start: ${rowStart};`}
  ${!isResponsivenessObject(rowSpan) && rowSpan && `grid-row-end: span ${rowSpan};`}
`

export const GridItem = styled('div', {
  shouldForwardProp: (prop) => !filteredProps.includes(prop as string),
})<GridItemProps>`
  ${gridItemStyles}

  ${createBreakpointGridItemRules('base')}
  ${createBreakpointGridItemRules('xxs')}
  ${createBreakpointGridItemRules('xs')}
  ${createBreakpointGridItemRules('sm')}
  ${createBreakpointGridItemRules('md')}
  ${createBreakpointGridItemRules('lg')}
  ${createBreakpointGridItemRules('xl')}
  ${createBreakpointGridItemRules('xxl')}
`

export const FlexGridItem = styled(FlexBox, {
  shouldForwardProp: (prop) => !filteredProps.includes(prop as string),
})<GridItemProps>`
  ${gridItemStyles}

  ${createBreakpointGridItemRules('base')}
  ${createBreakpointGridItemRules('xxs')}
  ${createBreakpointGridItemRules('xs')}
  ${createBreakpointGridItemRules('sm')}
  ${createBreakpointGridItemRules('md')}
  ${createBreakpointGridItemRules('lg')}
  ${createBreakpointGridItemRules('xl')}
  ${createBreakpointGridItemRules('xxl')}
`
