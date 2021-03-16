import tileImg from '@/assets/tile-example.png'
import videoImg from '@/assets/video-example.png'
import { Text } from '@/shared/components'
import React from 'react'
import {
  ButtonGroup,
  CompositionWrapper,
  Header,
  HowItWorksButton,
  Overlay,
  SignInButton,
  SignInWrapper,
  StyledBackgroundPattern,
  SubTitle,
  Tile,
  VideoImageWrapper,
} from './SignInView.style'

type SignInViewProps = {
  onOpenModal: (val: boolean) => void
}

const SignInView: React.FC<SignInViewProps> = ({ onOpenModal }) => {
  return (
    <SignInWrapper>
      <Header>
        <Text variant="h1">Start your Joystream channel for free!</Text>
        <SubTitle variant="h3">
          Joystream Studio is a space for Joystream Content Creators. Sign in and start publishing now!
        </SubTitle>
        <StyledBackgroundPattern />
        <ButtonGroup>
          <SignInButton onClick={() => onOpenModal(true)} size="large">
            Sign in For Free
          </SignInButton>
          <HowItWorksButton variant="secondary" size="large">
            How it works?
          </HowItWorksButton>
        </ButtonGroup>
      </Header>
      <CompositionWrapper>
        <VideoImageWrapper>
          <img src={videoImg} />
        </VideoImageWrapper>
        <Tile src={tileImg} />
      </CompositionWrapper>
      <Overlay />
    </SignInWrapper>
  )
}

export default SignInView
