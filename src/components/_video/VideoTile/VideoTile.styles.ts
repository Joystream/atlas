import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

export const VideoTileContainer = styled.div<{ direction: 'vertical' | 'horizontal' }>`
  display: flex;
  gap: ${sizes(4)};
  ${({ direction }) =>
    direction === 'vertical'
      ? css`
          flex-direction: column;
        `
      : css`
          flex-direction: row;

          /* tile's max-width * 2 + gap = 320px * 2 + 16px */
          max-width: 656px;
        `};
`
