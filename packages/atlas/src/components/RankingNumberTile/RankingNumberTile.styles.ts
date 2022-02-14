import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, media, oldColors, zIndex } from '@/styles'

export const RankingNumberTileWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
`

const variantStyles = (doubleDigit: boolean) => {
  return doubleDigit
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
  doubleDigit: boolean
}

export const RankingNumber = styled.div<RankingNumberProps>`
  position: absolute;
  z-index: ${zIndex.closeBackground};
  left: 0;
  color: black;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: ${oldColors.gray[500]};
  line-height: 100%;
  font-weight: 700;
  letter-spacing: -0.17em;
  font-family: ${cVar('typographyFontsPrimary')};
  font-size: 100px;
  height: 100%;
  display: flex;
  align-items: center;

  ${({ doubleDigit }) => variantStyles(doubleDigit)};
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
  margin-left: 32px;
  background: linear-gradient(90deg, rgb(0 0 0 / 0) 0%, #000 100%);
`
