import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { GridItem } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CallToActionWrapper } from '@/components/_buttons/CallToActionButton'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, sizes } from '@/styles'

export const PlayerContainer = styled.div`
  width: 100%;
  height: calc(100vw * 0.5625);
  ${media.md} {
    height: calc((100vw - var(--size-sidenav-width-collapsed)) * 0.5625);
    max-height: calc(70vh);
  }
`

export const PlayerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
`

export const PlayerSkeletonLoader = styled(SkeletonLoader)`
  height: 100%;
`

export const TitleContainer = styled.div`
  padding-bottom: ${sizes(6)};
  border-bottom: 1px solid ${cVar('colorCoreNeutral700')};
`

export const DescriptionSkeletonLoader = styled(SkeletonLoader)`
  height: 28px;
  margin: ${sizes(4)} 0 0;
`

export const Meta = styled(Text)`
  display: block;
  margin-top: ${sizes(2)};

  ${media.md} {
    margin-top: ${sizes(4)};
  }
`

export const TitleText = styled(Text)`
  word-break: break-word;
`

export const ChannelContainer = styled.div`
  margin-top: ${sizes(6)};

  ${media.md} {
    margin-top: ${sizes(8)};
  }
`

export const DetailsWrapper = styled.div`
  ${media.md} {
    padding-left: ${sizes(11)};
  }
`

export const DescriptionContainer = styled.div`
  margin-top: ${sizes(6)};
  margin-bottom: ${sizes(8)};

  ${media.md} {
    margin: ${sizes(8)} 0;
  }
`
export const DescriptionTitle = styled(Text)`
  margin-bottom: ${sizes(2)};
`

export const Category = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;

  svg {
    margin-right: ${sizes(2)};
  }
`

export const MoreVideosHeader = styled.h5`
  margin: 0 0 ${sizes(4)};
  font: ${cVar('typographyDesktopH400')};
  letter-spacing: ${cVar('typographyDesktopH400LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH400TextTransform')};
`

export const LicenceCategoryWrapper = styled.div<{ detailsExpanded: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  visibility: ${({ detailsExpanded }) => (detailsExpanded ? 'visible' : 'hidden')};
  max-height: ${({ detailsExpanded }) => (detailsExpanded ? 'auto' : '0')};
  overflow: ${({ detailsExpanded }) => (detailsExpanded ? 'unset' : 'hidden')};
  opacity: ${({ detailsExpanded }) => (detailsExpanded ? 1 : 0)};
  transition: opacity 150ms ease-out;
`

export const ExpandButton = styled(Button)`
  display: block;
  margin-top: ${sizes(2)};
`

export const LicenseContainer = styled(GridItem)`
  a {
    display: block;
    text-decoration: none;
    color: ${cVar('colorText')};
    font: ${cVar('typographyDesktopT200')};

    ${media.md} {
      font: ${cVar('typographyDesktopT300')};
    }
  }
`

export const CategoryWrapper = styled.div`
  text-align: left;

  path {
    fill: ${cVar('colorText')};
  }
`

export const NotFoundVideoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--size-topbar-height));
`

export const Details = styled.div`
  display: flex;
`

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin-top: ${sizes(8)};
`

export const MoreVideosContainer = styled.div`
  :not(:first-of-type) {
    margin-top: ${sizes(16)};
  }
`

export const MoreFrom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${cVar('colorCoreNeutral700')};
  padding-bottom: ${sizes(4)};
  margin-bottom: ${sizes(8)};
`

export const SeeMoreButton = styled(Button)`
  width: 100%;
  margin-top: ${sizes(8)};
`

export const StyledCallToActionWrapper = styled(CallToActionWrapper)`
  margin-top: ${sizes(16)};
`
