import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const limitedWidthContainerStyle = css`
  --max-inner-width: calc(1440px - var(--sidenav-collapsed-width) - calc(2 * var(--global-horizontal-padding)));

  max-width: var(--max-inner-width);
  position: relative;
  margin: 0 auto;
`
export const LimitedWidthContainer = styled.div`
  ${limitedWidthContainerStyle}
`
