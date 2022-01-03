import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

import { KebabMenuButtonIcon } from '../VideoTileDetails/VideoTileDetails.styles'

export const VideoTileContainer = styled.div<{ direction: 'vertical' | 'horizontal' }>`
  gap: ${sizes(4)};
  ${({ direction }) =>
    direction === 'horizontal'
      ? css`
          display: grid;
          grid-template-columns: repeat(2, minmax(160px, 320px));
        `
      : css`
          display: flex;
          flex-direction: column;
        `}
  :hover ${KebabMenuButtonIcon} {
    opacity: 1;
  }
`
