import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { SvgSigninIllustration } from '@/components/illustrations'
import { colors, media, sizes } from '@/theme'

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

export const LogoContainer = styled.div`
  display: inline-flex;

  ::after {
    align-self: center;
    padding: 2px 4px;
    margin-left: ${sizes(3)};
    background-color: ${colors.gray[600]};
    font-size: 10px;
    content: 'studio';
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
  margin-top: ${sizes(4)};
  color: ${colors.gray[200]};
`

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  text-decoration: none;
  margin-top: ${sizes(5)};

  path {
    stroke: ${colors.gray[300]};
  }
`
