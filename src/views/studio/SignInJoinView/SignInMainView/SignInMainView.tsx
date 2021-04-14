import { Button } from '@/shared/components'
import React from 'react'
import {
  ButtonGroup,
  Header,
  LogoContainer,
  SignInButton,
  StyledBackgroundPattern,
  StyledContainer,
  StyledHero,
  StyledSignInIllustrationSVG,
  SubTitle,
} from './SignInMainView.style'
import { ReactComponent as FullLogoSVG } from '@/assets/full-logo.svg'
import { absoluteRoutes } from '@/config/routes'
import { SvgGlyphChannel, SvgGlyphInfo } from '@/shared/icons'

export type Membership = {
  id: string
  handle: string
  about?: string
  avatarUri?: string
}

const SignInMainView: React.FC = () => {
  return (
    <StyledContainer>
      <Header>
        <LogoContainer>
          <FullLogoSVG />
        </LogoContainer>
        <StyledHero variant="hero">Welcome to - Joystream Studio</StyledHero>
        <SubTitle variant="body1">
          Start your journey as a Video Publisher. Create, manage and modify your channel and video content.
        </SubTitle>
        <ButtonGroup>
          <SignInButton icon={<SvgGlyphChannel />} size="large" to={absoluteRoutes.studio.join({ step: '0' })}>
            Sign in
          </SignInButton>
          <Button variant="secondary" icon={<SvgGlyphInfo />} size="large" to="https://www.joystream.org/">
            How it works?
          </Button>
        </ButtonGroup>
      </Header>
      <StyledSignInIllustrationSVG />
      <StyledBackgroundPattern />
    </StyledContainer>
  )
}

export default SignInMainView
