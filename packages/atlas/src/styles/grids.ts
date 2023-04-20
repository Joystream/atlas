import { breakpoints } from './breakpoints'

type BreakPointValue = {
  columns: number | 'auto'
  minItemWidth?: number
}

export type BreakpointKey = keyof typeof breakpoints

export type Grid = Partial<Record<BreakpointKey, BreakPointValue>>

export type GridWrapperProps = {
  grid?: Grid
}

export const DEFAULT_VIDEO_GRID = {
  xxs: {
    columns: 1,
  },
  xs: {
    columns: 1,
  },
  sm: {
    columns: 2,
  },
  md: {
    columns: 3,
  },
  lg: {
    columns: 4,
  },
  xl: {
    columns: 5,
  },
  xxl: {
    columns: 6,
  },
}
