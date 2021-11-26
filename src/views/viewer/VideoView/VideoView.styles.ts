import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { Text } from '@/components/Text'
import { ViewWrapper } from '@/components/ViewWrapper'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { breakpoints, cVar, media, oldColors, sizes } from '@/styles'

export const StyledViewWrapper = styled(ViewWrapper)`
  display: flex;
  flex-direction: column;
`

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

export const DescriptionSkeletonLoader = styled(SkeletonLoader)`
  height: 28px;
  margin: ${sizes(4)} 0 0;
`

export const InfoContainer = styled.div`
  padding: ${sizes(8)} 0;
`

export const Meta = styled(Text)`
  display: block;
  margin-top: ${sizes(1)};
  color: ${oldColors.gray[300]};

  ${fluidRange({ prop: 'fontSize', fromSize: '13px', toSize: '18px' }, breakpoints.xxs, breakpoints.xl)};
`

export const TitleText = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: '24px', toSize: '40px' }, breakpoints.xxs, breakpoints.xl)};

  word-break: break-word;
`

export const ChannelContainer = styled.div`
  margin-top: ${sizes(4)};
`

export const DescriptionContainer = styled.div`
  margin-top: ${sizes(6)};
  border-top: 1px solid ${oldColors.gray[800]};

  p {
    font: ${cVar('typographyDesktopT200')};
    letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT200TextTransform')};
    margin: ${sizes(4)} 0 0;

    ${media.sm} {
      font: ${cVar('typographyDesktopT300')};
      letter-spacing: ${cVar('typographyDesktopT300LetterSpacing')};
      text-transform: ${cVar('typographyDesktopT300TextTransform')};
      color: ${oldColors.gray[300]};
    }
  }
`

export const MoreVideosContainer = styled.div`
  margin-top: 88px;
`

export const MoreVideosHeader = styled.h5`
  margin: 0 0 ${sizes(4)};
  font: ${cVar('typographyDesktopH400')};
  letter-spacing: ${cVar('typographyDesktopH400LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH400TextTransform')};
`
export const LicenseContainer = styled.div`
  margin: ${sizes(4)} 0 0;
  color: ${oldColors.gray[500]};

  font: ${cVar('typographyDesktopH100')};
  letter-spacing: ${cVar('typographyDesktopH100LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH100TextTransform')};

  p {
    max-width: 60ch;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: ${oldColors.gray[500]};
  }
`

export const NotFoundVideoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--size-topbar-height));
`
