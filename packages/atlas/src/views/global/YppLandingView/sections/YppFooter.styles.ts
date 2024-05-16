import styled from '@emotion/styled'

import bottomLeftPattern from '@/assets/images/ypp-background-pattern.svg'
import topLeftBannerPattern from '@/assets/images/ypp-banner-pattern.svg'
import { cVar, media, sizes } from '@/styles'

export const CtaBanner = styled.div`
  padding: ${sizes(6)};
  background: ${cVar('colorBackgroundPrimary')};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${sizes(16)} 0;
  border-radius: ${cVar('radiusLarge')};

  ${media.xs} {
    padding: ${sizes(8)};
  }

  ${media.sm} {
    background-image: url(${bottomLeftPattern}), url(${topLeftBannerPattern});
    background-position: bottom left, top right;
    background-repeat: no-repeat, no-repeat;
    padding: ${sizes(16)} ${sizes(12)};
  }

  ${media.md} {
    margin: ${sizes(24)} 0;
  }
`
