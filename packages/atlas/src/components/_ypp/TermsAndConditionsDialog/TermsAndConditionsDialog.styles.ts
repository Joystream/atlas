import styled from '@emotion/styled'

import { sizes } from '@/styles'

export const TierItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${sizes(2)};
  row-gap: ${sizes(4)};
  margin-top: ${sizes(4)};
  margin-bottom: ${sizes(6)};

  * {
    :nth-child(3n) {
      text-align: right;
    }
  }
`
