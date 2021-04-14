import breakpoints from './breakpoints'

function buildQuery(br: string) {
  return `@media screen and (min-width: ${br})`
}

const media = {
  base: buildQuery(breakpoints.base),
  compact: buildQuery(breakpoints.compact),
  small: buildQuery(breakpoints.small),
  medium: buildQuery(breakpoints.medium),
  large: buildQuery(breakpoints.large),
  xlarge: buildQuery(breakpoints.xlarge),
  xxlarge: buildQuery(breakpoints.xxlarge),
}

export default media
