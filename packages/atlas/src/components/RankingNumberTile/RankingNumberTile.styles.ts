import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, media, oldColors, zIndex } from '@/styles'

export const RankingNumberTileWrapper = styled.div`
  display: flex;
  margin-left: 32px;
`

const variantStyles = (doubleDigits: boolean) => {
  return doubleDigits
    ? css`
        line-height: 85%;
        ${media.xxs} {
          font-size: 96px;
        }
        ${media.sm} {
          font-size: 136px;
        }
      `
    : css`
        ${media.xxs} {
          font-size: 104px;
        }
        ${media.sm} {
          font-size: 160px;
        }
      `
}

type RankingNumberProps = {
  doubleDigits: boolean
}

export const RankingNumber = styled.div<RankingNumberProps>`
  position: relative;
  z-index: ${zIndex.closeBackground};
  color: black;
  left: 8px;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: ${oldColors.gray[500]};
  font-weight: 700;
  letter-spacing: -0.17em;
  font-family: ${cVar('typographyFontsPrimary')};
  font-size: 100px;
  display: flex;
  align-items: center;
  writing-mode: vertical-rl;
  text-orientation: upright;
  flex-direction: column;
  margin-left: 8px;

  ${({ doubleDigits }) => variantStyles(doubleDigits)};
`

export const RankingNumberInner = styled.div`
  line-height: 0;
`

export const ChildrenWrapper = styled.div`
  align-self: baseline;
  --ranking-number-gap: 48px;

  margin-right: 24px;
  margin-left: 0;
  background-color: black;
  width: calc(100% - var(--ranking-number-gap));
  ${media.md} {
    --ranking-number-gap: 72px;
  }
  ${media.xl} {
    --ranking-number-gap: 92px;
  }
`

export const DropShadow = styled.div`
  width: 32px;
  background: linear-gradient(90deg, rgb(0 0 0 / 0) 0%, #000 100%);
  margin-left: 8px;
`
