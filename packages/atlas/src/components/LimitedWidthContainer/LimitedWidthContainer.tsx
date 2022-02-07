import styled from '@emotion/styled'

import { sizes } from '@/styles'

type LimitedWidthContainerProps = { big?: boolean }

export const LimitedWidthContainer = styled.div<LimitedWidthContainerProps>`
  --max-inner-width: calc(${({ big }) => (big ? '2284' : '1440')}px - calc(2 * var(--size-global-horizontal-padding)));

  max-width: var(--max-inner-width);
  position: relative;
  margin: 0 auto;
  padding-bottom: ${sizes(16)};
`
