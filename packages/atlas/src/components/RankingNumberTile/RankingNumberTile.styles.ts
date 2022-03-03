import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, media, zIndex } from '@/styles'

export const RankingNumberTileWrapper = styled.div`
  display: flex;
  flex-direction: row;
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
  ${media.xxs} {
    width: 40px;
  }
  ${media.sm} {
    width: 64px;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${zIndex.closeBackground};
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: ${cVar('typographyFontsPrimary')};
  font-style: normal;
  font-weight: 600;
  line-height: 85%;
  color: black;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: var(--color-border);
  overflow: visible;

  ${({ doubleDigits }) => variantStyles(doubleDigits)};
`

export const ChildrenWrapper = styled.div`
  position: relative;
  right: 32px;
  background-color: black;
  width: 100%;
`

export const DropShadow = styled.div`
  width: 32px;
  background: linear-gradient(90deg, rgb(0 0 0 / 0) 0%, #000 100%);
  position: relative;
  right: 32px;
`
