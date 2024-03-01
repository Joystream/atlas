import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

import { KebabMenuButtonIcon, VideoTitle } from '../VideoTileDetails/VideoTileDetails.styles'

export const VideoTileContainer = styled.div<{ direction: 'vertical' | 'horizontal' }>`
  gap: ${sizes(4)};
  ${({ direction }) =>
    direction === 'horizontal'
      ? css`
          display: grid;
          width: 100%;
          grid-template-columns: minmax(160px, 320px) 1fr;

          ${VideoTitle} {
            -webkit-line-clamp: 2;
          }
        `
      : css`
          display: flex;
          flex-direction: column;
        `}
  :hover ${KebabMenuButtonIcon} {
    opacity: 1;
  }
`
