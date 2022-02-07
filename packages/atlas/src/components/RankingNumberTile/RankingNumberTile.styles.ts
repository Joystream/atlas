import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, media, oldColors } from '@/styles'

export const RankingNumberTileWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
`

const variantStyles = (variant: 'channel' | 'video') => {
  switch (variant) {
    case 'channel':
      return css`
        ${media.md} {
          top: 0;
          align-items: flex-start;
          font-size: 140px;
        }
        ${media.xl} {
          font-size: 180px;
        }
      `
    case 'video':
      return css`
        ${media.md} {
          line-height: 0.7;
          font-size: 140px;
        }
        ${media.xl} {
          padding-top: 0;
          font-size: 180px;
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
  position: absolute;
  z-index: -5;
  left: 0;
  color: black;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: ${oldColors.gray[500]};
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.17em;
  font-family: ${cVar('typographyFontsPrimary')};
  font-size: 100px;
  height: 0;
  padding-top: 3%;

  ${({ variant }) => variantStyles(variant)};
`

export const ChildrenWrapper = styled.div`
  align-self: baseline;
  --ranking-number-gap: 48px;

  width: calc(100% - var(--ranking-number-gap));
  ${media.md} {
    --ranking-number-gap: 72px;
  }
  ${media.xl} {
    --ranking-number-gap: 92px;
  }
`
