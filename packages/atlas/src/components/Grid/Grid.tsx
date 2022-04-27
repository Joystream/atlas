import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useRef } from 'react'
import useResizeObserver from 'use-resize-observer'

import { media, sizes } from '@/styles'
import { isIphone } from '@/utils/browser'
import { toPx } from '@/utils/styles'

type GridProps = {
  gap?: number | string
  className?: string
  maxColumns?: number | null
  minWidth?: number | string
  repeat?: 'fit' | 'fill'
  onResize?: (sizes: number[]) => void
}

export const Grid: React.FC<GridProps> = ({
  className,
  gap = sizes(6),
  onResize,
  repeat = 'fill',
  maxColumns = 6,
  minWidth = 250,
  ...props
}) => {
  const gridRef = useRef<HTMLImageElement>(null)
  useResizeObserver<HTMLDivElement>({
    ref: gridRef,
    // border box seems to be not working on iPhone
    // setting border-box is causing a bug on ios with videos loading infinetely See: https://github.com/Joystream/atlas/issues/2561
    box: isIphone ? 'content-box' : 'border-box',
    onResize: () => {
      if (onResize && gridRef.current) {
        const computedStyles = window.getComputedStyle(gridRef.current)
        const columnSizes = computedStyles.gridTemplateColumns.split(' ').map(parseFloat)
        onResize(columnSizes)
      }
    },
  })

  return (
    <Container
      {...props}
      className={className}
      ref={gridRef}
      gap={gap}
      minWidth={minWidth}
      maxColumns={maxColumns}
      repeat={repeat}
    />
  )
}

type ContainerProps = Required<Pick<GridProps, 'gap' | 'maxColumns' | 'minWidth' | 'repeat'>>

const maxColumnsCss = ({ maxColumns }: ContainerProps) =>
  maxColumns
    ? css`
        ${media.xl} {
          grid-template-columns: repeat(${maxColumns}, minmax(0, 1fr));
        }
      `
    : null

const Container = styled.div<ContainerProps>`
  display: grid;
  gap: ${(props) => toPx(props.gap)};
  grid-template-columns: repeat(
    auto-${(props) => props.repeat},
    minmax(min(${(props) => toPx(props.minWidth)}, 100%), 1fr)
  );
  ${maxColumnsCss};
`

type BreakpointsToMatchGridArg = {
  breakpoints: number
  minItemWidth: number
  gridColumnGap?: number
  viewportContainerDifference?: number
}
//  This will generate the Array of breakpoints at which the Grid adds one element
export function breakpointsOfGrid({
  breakpoints = 0,
  minItemWidth,
  gridColumnGap = 0,
  viewportContainerDifference = 0,
}: BreakpointsToMatchGridArg) {
  return Array(breakpoints)
    .fill(null)
    .map((_, n) => (n + 1) * minItemWidth + n * gridColumnGap + viewportContainerDifference)
}
