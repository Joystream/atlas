import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, media, zIndex } from '@/styles'

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const NumberWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 40px;
  min-width: 40px;
  ${media.sm} {
    width: 64px;
    min-width: 64px;
  }
`

const getRankingNumberTypographyCss = ({ doubleDigits }: RankingNumberProps) => {
  return doubleDigits
    ? css`
        line-height: 85%;
        font-size: 96px;
        ${media.sm} {
          font-size: 136px;
        }
      `
    : css`
        line-height: 100%;
        font-size: 104px;
        ${media.sm} {
          font-size: 160px;
        }
      `
}

type RankingNumberProps = {
  doubleDigits: boolean
}

export const RankingNumber = styled.span<RankingNumberProps>`
  z-index: ${zIndex.closeBackground};
  min-width: 0;
  font-family: ${cVar('typographyFontsPrimary')};
  font-weight: 700;
  text-align: left;
  color: ${cVar('colorCoreBaseBlack')};
  word-break: break-all;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: ${cVar('colorBorder')};

  ${getRankingNumberTypographyCss};
`

export const DropShadow = styled.div`
  width: 20px;
  ${media.sm} {
    width: 32px;
  }

  background: linear-gradient(90deg, rgb(0 0 0 / 0) 0%, #000 100%);
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
`

export const ChildrenWrapper = styled.div`
  width: 100%;
`
