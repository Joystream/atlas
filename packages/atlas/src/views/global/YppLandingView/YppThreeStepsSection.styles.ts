import styled from '@emotion/styled'

import { GridItem } from '@/components/LayoutGrid'
import { cVar, media, sizes } from '@/styles'

import { imageShadow } from './YppLandingView.styles'

export const StepCard = styled.article`
  text-align: left;
  padding: ${sizes(4)} ${sizes(4)} 0;
  display: grid;
  gap: ${sizes(4)};
  width: 280px;
  height: 360px;
  overflow-y: hidden;
  position: relative;
  margin: 0 auto;
  background-color: ${cVar('colorBackground')};
  ${media.md} {
    gap: ${sizes(6)};
    padding: ${sizes(6)} ${sizes(6)} 0;
    width: 100%;
    height: 400px;
  }
  ${media.lg} {
    height: 480px;
  }
`
export const StepCardsWrapper = styled(GridItem)`
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(4)};
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  ${media.md} {
    ${StepCard}:nth-of-type(2) {
      margin-top: ${sizes(16)};
    }
    ${StepCard}:nth-of-type(3) {
      margin-top: ${sizes(32)};
    }
  }
`

export const StepCardNumber = styled.span`
  font-family: ${cVar('typographyFontsPrimary')};
  color: ${cVar('colorBackground')};
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: ${cVar('colorBorder')};
  font-weight: 600;
  font-size: 48px;
  line-height: 100%;
  ${media.md} {
    -webkit-text-stroke-width: 3px;
    font-size: 64px;
  }
`

export const StepCardImg = styled.img`
  display: block;
  max-width: 100%;
  ${imageShadow};
`

export const StepCardFade = styled.div`
  position: absolute;
  z-index: 1;
  background: linear-gradient(180deg, rgb(24 28 32 / 0) 0%, ${cVar('colorBackground')} 100%);
  height: 64px;
  width: 100%;
  bottom: 0;
`
