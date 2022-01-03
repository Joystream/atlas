import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

export const VideoTileContainer = styled.div<{ direction: 'vertical' | 'horizontal' }>`
  display: grid;
  gap: ${sizes(4)};
  ${({ direction }) =>
    direction === 'horizontal' &&
    css`
      grid-template-columns: repeat(2, minmax(160px, 320px));
    `};
`
