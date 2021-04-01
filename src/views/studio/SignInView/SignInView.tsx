import { StudioContainer } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { Button, Text } from '@/shared/components'
import React from 'react'
import {
  ButtonGroup,
  CompositionWrapper,
  Header,
  Overlay,
  SignInButton,
  SignInWrapper,
  StyledBackgroundPattern,
  SubTitle,
  TileImgBg,
  VideoImgBg,
} from './SignInView.style'

export type Membership = {
  id: string
  handle: string
  about?: string
  avatarUri?: string
}

const SignInView = () => {
  return (
    <StudioContainer>
      <StyledBackgroundPattern />
      <CompositionWrapper>
        <VideoImgBg />
        <TileImgBg />
      </CompositionWrapper>
      <Overlay />
      <SignInWrapper>
        <Header>
          <Text variant="h1">Start your Joystream channel for free!</Text>
          <SubTitle variant="h3">
            Joystream Studio is a space for Joystream Content Creators. Sign in and start publishing now!
          </SubTitle>
          <ButtonGroup>
            <SignInButton to={absoluteRoutes.studio.selectMembership()} size="large">
              Sign in For Free
            </SignInButton>
            <Button variant="secondary" size="large" to="https://www.joystream.org/">
              How it works?
            </Button>
          </ButtonGroup>
        </Header>
      </SignInWrapper>
    </StudioContainer>
  )
}

export default SignInView
