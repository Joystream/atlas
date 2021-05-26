import { ReactComponent as SignInIllustrationSVG } from '@/assets/signin-illustration.svg'
import { StudioContainer } from '@/components'
import { Button, Text } from '@/shared/components'
import { media, colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const StyledContainer = styled(StudioContainer)`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 100px;
  ${media.medium} {
    flex-direction: row;
    justify-content: space-between;
  }
  ${media.xlarge} {
    margin-top: 80px;
    max-width: 1700px;
    left: 150px;
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
  ${media.large} {
    max-width: 550px;
  }
`

export const StyledHero = styled(Text)`
  margin-top: ${sizes(8)};
`

export const StyledSignInIllustrationSVG = styled(SignInIllustrationSVG)`
  margin-top: 60px;
  align-self: center;
  width: 100%;
  ${media.medium} {
    position: relative;
    left: -50px;
    margin-top: 0px;
  }
  ${media.large} {
    width: unset;
  }
`

export const ButtonGroup = styled.div`
  margin-top: ${sizes(12)};
  display: flex;
  flex-direction: column;
  ${media.small} {
    flex-direction: row;
  }
`
export const SignInButton = styled(Button)`
  margin-bottom: ${sizes(4)};
  ${media.small} {
    margin-bottom: unset;
    margin-right: ${sizes(4)};
  }
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(4)};
  color: ${colors.gray[200]};
`
