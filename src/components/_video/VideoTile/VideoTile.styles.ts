import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const VideoTileContainer = styled.div<{ direction: 'vertical' | 'horizontal' }>`
  display: flex;
  gap: 16px;
  ${({ direction }) =>
    direction === 'vertical'
      ? css`
          flex-direction: column;
          max-width: 320px;
        `
      : css`
          flex-direction: row;
          max-width: 656px;
        `};
`
