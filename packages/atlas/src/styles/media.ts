import { breakpoints } from './breakpoints'

function buildQuery(br: string) {
  return `@media screen and (min-width: ${br})`
}

export const media = {
  xxs: buildQuery(breakpoints.xxs),
  xs: buildQuery(breakpoints.xs),
  sm: buildQuery(breakpoints.sm),
  md: buildQuery(breakpoints.md),
  lg: buildQuery(breakpoints.lg),
  xl: buildQuery(breakpoints.xl),
  xxl: buildQuery(breakpoints.xxl),
  landscape: '(orientation: landscape) and (hover: none) and (pointer: coarse)',
}
