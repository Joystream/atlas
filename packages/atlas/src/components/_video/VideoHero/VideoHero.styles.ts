import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { cVar, media, sizes } from '@/styles'

type IsCategoryProp = {
  isCategory?: boolean
}

export const PlaceholderContainer = styled.section<IsCategoryProp>`
  position: relative;
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
  padding: ${({ isCategory }) => (isCategory ? sizes(8) : sizes(16))} var(--size-global-horizontal-padding) 0;
`

export const CategoryBackgroundImageOverlay = styled.div<{ coverImgUrl?: string; blurImage?: boolean }>`
  background-image: ${({ coverImgUrl }) => (coverImgUrl ? `url(${coverImgUrl}) ` : 'unset')};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  filter: ${({ blurImage }) => (blurImage ? `blur(${sizes(4)}) ` : 'unset')};
`

export const PlaceholderInfoContainer = styled.div`
  position: relative;
  margin: auto;
  max-width: 2284px;
`

export const CategoryTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${sizes(16)};

  ${media.sm} {
    margin-top: ${sizes(32)};
    margin-bottom: ${sizes(32)};
  }
`

export const Container = styled.section<IsCategoryProp>`
  position: relative;
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
  padding: 36px var(--size-global-horizontal-padding) 16px;
  display: grid;

  ${media.sm} {
    padding: 32px var(--size-global-horizontal-padding);
    height: ${({ isCategory }) => (isCategory ? '392px' : '66.6667vh')};
  }
`

export const BackgroundContainer = styled.div<IsCategoryProp>`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ isCategory }) => (isCategory ? '360px' : '240px')};

  ${media.sm} {
    bottom: -128px;
    height: auto;
  }
`

export const GradientOverlay = styled.div<{ withSolidOverlay?: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
      180deg,
      transparent 50%,
      ${cVar('colorCoreBaseBlack')} 93.23%,
      ${cVar('colorCoreBaseBlack')} 100%
    ),
    radial-gradient(50.66% 101.32% at 50% 50%, transparent 0%, ${cVar('colorCoreNeutral500Darken')} 100%)
      ${({ withSolidOverlay }) => withSolidOverlay && `, ${cVar('colorCoreNeutral500Darken')}`};
`

export const InfoContainer = styled.div<IsCategoryProp>`
  position: relative;
  align-self: end;
  margin-top: ${({ isCategory }) => (isCategory ? '208px' : '124px')};
  width: 100%;
  ${media.sm} {
    margin-top: unset;
  }
`

export const StyledChannelLink = styled(ChannelLink)`
  margin-bottom: ${sizes(4)};
`

export const StyledLayoutGrid = styled(LayoutGrid)`
  height: 110px;
  align-items: center;

  ${media.sm} {
    height: auto;
  }
`

export const TitleContainer = styled.div`
  /* stylelint-disable-next-line value-no-vendor-prefix */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  a {
    text-decoration: none;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  margin-top: ${sizes(4)};

  ${media.sm} {
    margin-top: ${sizes(8)};
  }

  > * + * {
    margin-left: ${sizes(4)};
    flex-shrink: 0;
  }
`
