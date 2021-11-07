import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { SkeletonLoader } from '@/components/SkeletonLoader'
import { Text } from '@/components/Text'
import { ViewWrapper } from '@/components/ViewWrapper'
import { breakpoints, colors, media, sizes, typography } from '@/theme'

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
  color: ${colors.gray[300]};

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
  border-top: 1px solid ${colors.gray[800]};

  p {
    font-size: ${typography.sizes.body2};
    margin: ${sizes(4)} 0 0;

    ${media.sm} {
      font-size: 1rem;
      color: ${colors.gray[300]};
      line-height: 175%;
    }
  }
`

export const MoreVideosContainer = styled.div`
  margin-top: 88px;
`

export const MoreVideosHeader = styled.h5`
  margin: 0 0 ${sizes(4)};
  font-size: ${typography.sizes.h5};
`
export const LicenseContainer = styled.div`
  margin: ${sizes(4)} 0 0;
  font-size: ${typography.sizes.overhead};
  color: ${colors.gray[500]};
  letter-spacing: 0.03rem;
  line-height: 1.7;

  p {
    max-width: 60ch;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: ${colors.gray[500]};
  }
`

export const NotFoundVideoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--size-topbar-height));
`
