import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { BreakpointKey, Grid, media, sizes } from '@/styles'

export type GridWrapperProps = {
  grid?: Grid
}

const createGridBreakpoints = ({ grid = { xxs: { columns: 'auto', minItemWidth: 300 } } }: GridWrapperProps) => {
  const gridKeys = Object.keys(grid) as Array<BreakpointKey>

  const styles = gridKeys.map((key) => {
    const gridValue = grid[key]
    const repeatCounts = gridValue?.columns === 'auto' ? 'auto-fill' : gridValue?.columns
    const tracks = gridValue?.columns === 'auto' ? `minmax(${gridValue.minItemWidth}, 1fr)` : 'minmax(0, 1fr)'
    return css`
      ${media[key]} {
        grid-template-columns: repeat(${repeatCounts}, ${tracks});
      }
    `
  })
  return styles
}

export const GridWrapper = styled.div<GridWrapperProps>`
  display: grid;
  gap: ${sizes(4)};

  ${media.md} {
    gap: ${sizes(6)};
  }

  ${createGridBreakpoints}
`
