import React from 'react'

import { Button } from '@/components/Button'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { SvgGlyphChannel, SvgGlyphChevronLeft, SvgGlyphInfo } from '@/icons'
import { SvgJoystreamLogoFull } from '@/illustrations'

import {
  BackLink,
  ButtonGroup,
  Header,
  LogoContainer,
  SignInButton,
  StyledContainer,
  StyledHero,
  StyledSignInIllustrationSVG,
  SubTitle,
} from './SignInMainView.style'

export type Membership = {
  id: string
  handle: string
  about?: string
  avatarUri?: string
}

export const SignInMainView: React.FC = () => {
  return (
    <StyledContainer>
      <Header>
        <LogoContainer>
          <SvgJoystreamLogoFull />
        </LogoContainer>
        <StyledHero variant="hero">Welcome to Joystream Studio</StyledHero>
        <SubTitle variant="body1">
          Start your journey as a Video Publisher. Publish and manage your channel and video content.
        </SubTitle>
        <ButtonGroup>
          <SignInButton icon={<SvgGlyphChannel />} size="large" to={absoluteRoutes.studio.signInJoin({ step: '0' })}>
            Sign in
          </SignInButton>
          <Button variant="secondary" icon={<SvgGlyphInfo />} size="large" to="https://www.joystream.org/">
            How it works?
          </Button>
        </ButtonGroup>
        <BackLink to={absoluteRoutes.viewer.index()}>
          <SvgGlyphChevronLeft />
          <Text secondary>Go back</Text>
        </BackLink>
      </Header>
      <StyledSignInIllustrationSVG />
    </StyledContainer>
  )
}
