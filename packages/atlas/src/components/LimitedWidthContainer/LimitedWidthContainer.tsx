import styled from '@emotion/styled'

import { sizes } from '@/styles'

type LimitedWidthContainerProps = { big?: boolean; noBottomPadding?: boolean; fullWidth?: boolean }

export const LimitedWidthContainer = styled.div<LimitedWidthContainerProps>`
  --max-inner-width: calc(${({ big }) => (big ? '2284' : '1440')}px - calc(2 * var(--size-global-horizontal-padding)));

  max-width: var(--max-inner-width);
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'unset')};
  position: relative;
  margin: 0 auto;
  padding-bottom: ${({ noBottomPadding }) => (noBottomPadding ? 0 : sizes(16))};
`
