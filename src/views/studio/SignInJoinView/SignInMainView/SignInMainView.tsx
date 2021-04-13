import { StudioContainer } from '@/components'
import { Button, Text } from '@/shared/components'
import React from 'react'
import {
  ButtonGroup,
  CompositionWrapper,
  Header,
  Overlay,
  SignInButton,
  Wrapper,
  StyledBackgroundPattern,
  SubTitle,
  TileImgBg,
  VideoImgBg,
} from './SignInMainView.style'

export type Membership = {
  id: string
  handle: string
  about?: string
  avatarUri?: string
}

type SignInMainViewProps = {
  onButtonClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SignInMainView: React.FC<SignInMainViewProps> = ({ onButtonClick }) => {
  return (
    <StudioContainer>
      <StyledBackgroundPattern />
      <CompositionWrapper>
        <VideoImgBg />
        <TileImgBg />
      </CompositionWrapper>
      <Overlay />
      <Wrapper>
        <Header>
          <Text variant="h1">Start your Joystream channel for free!</Text>
          <SubTitle variant="h3">
            Joystream Studio is a space for Joystream Content Creators. Sign in and start publishing now!
          </SubTitle>
          <ButtonGroup>
            <SignInButton size="large" onClick={onButtonClick}>
              Sign in For Free
            </SignInButton>
            <Button variant="secondary" size="large" to="https://www.joystream.org/">
              How it works?
            </Button>
          </ButtonGroup>
        </Header>
      </Wrapper>
    </StudioContainer>
  )
}

export default SignInMainView
