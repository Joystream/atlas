import styled from '@emotion/styled'

import bottomLeftPattern from '@/assets/images/ypp-background-pattern.svg'
import topLeftBannerPattern from '@/assets/images/ypp-banner-pattern.svg'
import { Text } from '@/components/Text'
import { GoogleButton } from '@/components/_buttons/GoogleButton'
import { cVar, media, sizes } from '@/styles'

export const CtaBanner = styled.div`
  padding: ${sizes(16)} ${sizes(8)};
  background: ${cVar('colorBackgroundPrimary')};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${sizes(16)} 0;
  ${media.sm} {
    margin: ${sizes(24)} 0;
    background-image: url(${bottomLeftPattern}), url(${topLeftBannerPattern});
    background-position: bottom left, top right;
    background-repeat: no-repeat, no-repeat;
  }
  ${media.md} {
    padding: ${sizes(24)} ${sizes(12)};
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

export const StyledButton = styled(GoogleButton)`
  margin-top: ${sizes(8)};
`
