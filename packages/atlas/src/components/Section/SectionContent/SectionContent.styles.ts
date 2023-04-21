import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

export const GridWrapper = styled.div<{ minWidth: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${(props) => `${props.minWidth}px, 1fr`}));
  gap: ${sizes(4)};

  ${media.md} {
    gap: ${sizes(6)};
  }
`
