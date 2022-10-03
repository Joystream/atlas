import styled from '@emotion/styled'

import { sizes } from '@/styles'

export const TierItem = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: ${sizes(2)};
  row-gap: ${sizes(4)};
  margin-top: ${sizes(4)};
  margin-bottom: ${sizes(6)};
  align-items: center;

  svg {
    width: 18px;
    max-height: 18px;
  }

  * {
    :nth-child(4n) {
      text-align: right;
    }
  }
`
