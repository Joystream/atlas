import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, media, sizes } from '@/shared/theme'

export const RankingNumberTileWrapper = styled.div`
  display: grid;
  grid-template-columns: 25% 1fr;
  position: relative;
  ${media.medium} {
    grid-template-columns: 22% 1fr;
  }
`

const variantStyles = (variant: 'channel' | 'video') => {
  switch (variant) {
    case 'channel':
      return css`
        align-items: center;
        top: -${sizes(5)};
        ${media.medium} {
          top: 0;
          align-items: flex-start;
          font-size: 140px;
        }
        ${media.large} {
          font-size: 180px;
        }
      `
    case 'video':
      return css`
        align-items: flex-start;
        ${media.medium} {
          line-height: 0.7;
          font-size: 100px;
        }
        ${media.large} {
          font-size: 140px;
        }

        ${media.xlarge} {
          font-size: 160px;
        }
      `
    default:
      return null
  }
}

type RankingNumberProps = {
  variant: 'channel' | 'video'
}
export const RankingNumber = styled.div<RankingNumberProps>`
  position: relative;
  line-height: 1;
  z-index: -5;
  left: ${sizes(2)};
  color: black;
  font-weight: 700;
  font-size: 100px;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: ${colors.gray[500]};
  font-family: 'PxGrotesk', sans-serif;
  letter-spacing: -0.17em;
  display: flex;

  ${media.medium} {
    left: -${sizes(2)};
  }

  ${({ variant }) => variantStyles(variant)};
`
