import React from 'react'

import { Text } from '@/components/Text'
import { CreateMemberModal } from '@/components/_auth/CreateMemberModal'
import { SignInStepsStepper } from '@/components/_auth/SignInSteps'
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
} from './SignInView.styles'

export type Membership = {
  id: string
  handle: string
  about?: string
  avatarUri?: string
}

export const SignInView: React.FC = () => {
  return (
    <StyledContainer>
      <Header>
        <LogoContainer>
          <SvgJoystreamLogoFull />
        </LogoContainer>
        <StyledHero variant="h900">Welcome to Joystream Studio</StyledHero>
        <SubTitle variant="t300">
          Start your journey as a Video Publisher. Publish and manage your channel and video content.
        </SubTitle>
        <ButtonGroup>
          <SignInButton icon={<SvgActionChannel />} size="large" to={absoluteRoutes.studio.signIn({ step: '1' })}>
            Sign in
          </SignInButton>
          <Button variant="secondary" icon={<SvgActionInformative />} size="large" to="https://www.joystream.org/">
            How it works?
          </Button>
        </ButtonGroup>
        <BackLink to={absoluteRoutes.viewer.index()}>
          <SvgActionChevronL />
          <Text variant="t200" secondary>
            Go back
          </Text>
        </BackLink>
      </Header>
      <StyledSignInIllustrationSVG />
      <SignInStepsStepper />
      <CreateMemberModal />
    </StyledContainer>
  )
}
