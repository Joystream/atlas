import styled from '@emotion/styled'

import bottomLeftPattern from '@/assets/images/ypp-background-pattern.svg'
import topLeftBannerPattern from '@/assets/images/ypp-banner-pattern.svg'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CallToActionButton } from '@/components/_buttons/CallToActionButton'
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
`

export const HeroGridItem = styled(GridItem)`
  margin: ${sizes(16)} 0;
  align-self: center;
  ${media.md} {
    margin: ${sizes(24)} 0;
  }
`

export const BackgroundContainer = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};
  margin-left: calc(-1 * var(--size-global-horizontal-padding));
  margin-right: calc(-1 * var(--size-global-horizontal-padding));
  padding: 0 var(--size-global-horizontal-padding);
`

export const CardsWithImagesContainer = styled.div`
  padding-top: ${sizes(16)};
  padding-bottom: ${sizes(4)};
  display: grid;
  gap: ${sizes(16)};

  ${media.md} {
    padding-top: ${sizes(24)};
    padding-bottom: ${sizes(8)};
  }
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

export const BannerContainerLayoutGrid = styled(LayoutGrid)`
  padding: ${sizes(16)} 0;
  ${media.sm} {
    padding: ${sizes(24)} 0;
  }
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

export const StyledCallToActionButton = styled(CallToActionButton)``
