import React from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChannel, SvgActionChevronL, SvgActionInformative } from '@/components/_icons'
import { SvgJoystreamLogoFull } from '@/components/_illustrations'
import { absoluteRoutes } from '@/config/routes'

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
} from './SignInMainView.styles'

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
          <SignInButton icon={<SvgActionChannel />} size="large" to={absoluteRoutes.studio.signInJoin({ step: '0' })}>
            Sign in
          </SignInButton>
          <Button variant="secondary" icon={<SvgActionInformative />} size="large" to="https://www.joystream.org/">
            How it works?
          </Button>
        </ButtonGroup>
        <BackLink to={absoluteRoutes.viewer.index()}>
          <SvgActionChevronL />
          <Text secondary>Go back</Text>
        </BackLink>
      </Header>
      <StyledSignInIllustrationSVG />
    </StyledContainer>
  )
}
