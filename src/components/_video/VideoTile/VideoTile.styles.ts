import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const VideoTileContainer = styled.div<{ direction: 'vertical' | 'horizontal' }>`
  display: grid;
  gap: 16px;
  ${({ direction }) =>
    direction === 'vertical'
      ? css`
          grid-auto-flow: row;
          max-width: 320px;
        `
      : css`
          grid-auto-flow: column;
          max-width: 656px;
          grid-template-columns: 1fr 1fr;
        `};
`
