import { css } from '@emotion/react'

export const ignoreGlobalPadding = css`
  margin-left: calc(-1 * var(--size-global-horizontal-padding));
  margin-right: calc(-1 * var(--size-global-horizontal-padding));
`
