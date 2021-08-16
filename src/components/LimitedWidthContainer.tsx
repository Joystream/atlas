import { css } from '@emotion/react'
import styled from '@emotion/styled'

type LimitedWidthContainerProps = { big?: boolean }

export const limitedWidthContainerStyle = (props: LimitedWidthContainerProps) => css`
  --max-inner-width: calc(
    ${props.big ? '2284' : '1440'}px - var(--sidenav-collapsed-width) - calc(2 * var(--global-horizontal-padding))
  );

  max-width: var(--max-inner-width);
  position: relative;
  margin: 0 auto;
`

export const LimitedWidthContainer = styled.div<LimitedWidthContainerProps>`
  ${limitedWidthContainerStyle}
`
