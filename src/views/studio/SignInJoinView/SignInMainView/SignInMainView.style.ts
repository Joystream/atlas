import { ReactComponent as SignInIllustrationSVG } from '@/assets/signin-illustration.svg'
import { ReactComponent as SignInPatternSVG } from '@/assets/signin-pattern.svg'
import { StudioContainer } from '@/components'
import { Button, Text } from '@/shared/components'
import { media, colors, sizes, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'

export const StyledContainer = styled(StudioContainer)`
  margin-top: 64px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  ${media.medium} {
    text-align: unset;
    justify-content: space-between;
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
  margin-top: 60px;
  max-width: 400px;
  ${media.medium} {
    max-width: 540px;
  }
  ${media.large} {
    max-width: 600px;
  }
`

export const StyledHero = styled(Text)`
  margin-top: ${sizes(8)};
`

export const StyledSignInIllustrationSVG = styled(SignInIllustrationSVG)`
  margin-top: 60px;
  align-self: center;
  max-width: 420px;
  ${media.large} {
    max-width: unset;
  }
`

export const StyledBackgroundPattern = styled(SignInPatternSVG)`
  position: absolute;
  top: 0;
  right: 50px;
  z-index: ${zIndex.background};
`

export const ButtonGroup = styled.div`
  margin-top: ${sizes(12)};
`
export const SignInButton = styled(Button)`
  margin-right: ${sizes(3)};
  margin-bottom: ${sizes(3)};
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(4)};
  color: ${colors.gray[200]};
`
