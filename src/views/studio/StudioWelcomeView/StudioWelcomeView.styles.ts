import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgSigninIllustration } from '@/components/_illustrations'
import { media, sizes } from '@/styles'

export const StyledContainer = styled(LimitedWidthContainer)`
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 100px;
  ${media.md} {
    flex-direction: row;
    justify-content: space-between;
  }
  ${media.xl} {
    max-width: 1400px;
    left: 150px;
  }
  ${media.xxl} {
    max-width: 1700px;
    margin-top: 128px;
  }
`

export const Header = styled.header`
  max-width: 550px;
`

export const StyledHero = styled(Text)`
  margin-top: ${sizes(8)};
`

export const StyledSignInIllustrationSVG = styled(SvgSigninIllustration)`
  margin-top: 60px;
  align-self: center;
  width: 100%;
  ${media.md} {
    position: relative;
    left: -50px;
    margin-top: 0;
  }
  ${media.lg} {
    max-width: 1000px;
  }
  ${media.xxl} {
    max-width: unset;
  }
`

export const ButtonGroup = styled.div`
  margin-top: ${sizes(12)};
  display: flex;
  flex-direction: column;
  ${media.sm} {
    flex-direction: row;
  }
`
export const SignInButton = styled(Button)`
  margin-bottom: ${sizes(4)};
  ${media.sm} {
    margin-bottom: unset;
    margin-right: ${sizes(4)};
  }
`

export const SubTitle = styled(Text)`
  display: block;
  margin-top: ${sizes(4)};
`
