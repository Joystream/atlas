import styled from '@emotion/styled'

import bottomLeftPattern from '@/assets/images/ypp-background-pattern.svg'
import topLeftBannerPattern from '@/assets/images/ypp-banner-pattern.svg'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes } from '@/styles'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin-top: ${sizes(16)};
  text-align: center;

  ${media.md} {
    margin-top: ${sizes(24)};
  }
`

export const HeroImageWrapper = styled.div`
  position: relative;
  margin: ${sizes(16)} auto 0 auto;

  ${media.md} {
    max-width: 888px;
  }

  ${media.lg} {
    max-width: 1152px;
  }
`

export const FrontImage = styled.img`
  will-change: transform;
  width: 100%;
  display: block;
`

export const BackImage = styled.img`
  position: absolute;
  width: 100%;
  display: block;
  left: 0;
  top: 0;
`

export const CenteredLayoutGrid = styled(LayoutGrid)`
  text-align: center;
  row-gap: 0;
  ${media.md} {
    row-gap: 0;
  }
`

export const HeaderGridItem = styled(GridItem)<{ marginBottom: number }>`
  margin-bottom: ${({ marginBottom = 0 }) => sizes(marginBottom)};
  align-self: center;
`

export const BackgroundContainer = styled.div<{ noBackground?: boolean }>`
  background-color: ${({ noBackground }) => (noBackground ? 'unset' : cVar('colorBackgroundMuted'))};
  margin-left: calc(-1 * var(--size-global-horizontal-padding));
  margin-right: calc(-1 * var(--size-global-horizontal-padding));
  padding: ${sizes(16)} var(--size-global-horizontal-padding);
  ${media.md} {
    padding: ${sizes(24)} var(--size-global-horizontal-padding);
  }
`

export const CardsWithImagesContainer = styled.div`
  display: grid;
  gap: ${sizes(16)};
`

export const CardImageRow = styled(LayoutGrid)`
  ${media.sm} {
    justify-items: center;
  }
  ${media.sm} {
    align-items: center;
  }
`

export const ImageContainer = styled.div<{
  reverseOrderOnDesktop?: boolean
  positionOnMobile?: 'center' | 'unset' | 'flex-end'
}>`
  position: relative;
  overflow-x: hidden;
  display: flex;
  justify-content: ${({ positionOnMobile = 'unset' }) => positionOnMobile};
  ${media.sm} {
    justify-content: unset;
  }
`

export const StepCard = styled.article`
  display: inline-block;
  text-align: left;
  padding: ${sizes(4)} ${sizes(4)} 0;
  display: grid;
  gap: ${sizes(4)};
  width: 280px;
  height: 360px;
  overflow-y: hidden;
  position: relative;
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

  ${media.sm} {
    justify-content: center;
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
`

export const StepCardFade = styled.div`
  position: absolute;
  z-index: 1;
  background: linear-gradient(180deg, rgb(24 28 32 / 0) 0%, ${cVar('colorBackground')} 100%);
  height: 64px;
  width: 100%;
  bottom: 0;
`
export const AbsolutelyPositionedImg = styled.img`
  position: absolute;
  z-index: 0;
  width: 100%;
  min-width: 480px;
  max-width: 640px;
`

export const RelativelyPositionedImg = styled.img`
  position: relative;
  z-index: 1;
  min-width: 480px;
  width: 100%;
  max-width: 640px;
`

export const StyledLimitedContainerWidth = styled(LimitedWidthContainer)`
  padding-bottom: unset;
`

export const CtaBanner = styled.div`
  padding: ${sizes(16)} ${sizes(8)};
  background: ${cVar('colorBackgroundPrimary')};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${media.sm} {
    background-image: url(${bottomLeftPattern}), url(${topLeftBannerPattern});
    background-position: bottom left, top right;
    background-repeat: no-repeat, no-repeat;
  }
`

export const StyledBannerText = styled(Text)`
  max-width: 400px;
  ${media.md} {
    max-width: 500px;
  }
  ${media.lg} {
    max-width: unset;
  }
`

export const StyledButton = styled(Button)`
  margin-top: ${sizes(8)};
  background-color: ${cVar('colorCoreBaseBlack')};
`

export const CtaCardRow = styled.div`
  display: grid;
  gap: ${sizes(4)};
  padding-bottom: ${sizes(16)};

  ${media.md} {
    grid-template-columns: 1fr 1fr 1fr;
    gap: ${sizes(6)};
    padding-bottom: ${sizes(24)};
  }
`
