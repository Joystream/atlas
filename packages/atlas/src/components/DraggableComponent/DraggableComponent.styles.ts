import styled from '@emotion/styled'

import { sizes } from '@/styles'

export const Wrapper = styled.div`
  display: flex;
  gap: ${sizes(3)};
  cursor: grab;

  svg {
    align-self: center;
  }
`
