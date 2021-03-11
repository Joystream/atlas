import Multistepper from '@/components/Dialogs/Multistepper'
import { useCheckBrowser } from '@/hooks'
import { Text } from '@/shared/components'
import React, { useState } from 'react'
import { AddPolkaDot, CreateOrSelectAccount, TermsAndConditions } from './SignInSteps'
import {
  ButtonGroup,
  HowItWorksButton,
  SignInButton,
  SignInWrapper,
  StyledBackgroundPattern,
  SubTitle,
  Tile,
  VideoImageWrapper,
  CompositionWrapper,
  Overlay,
  Header,
} from './SignInView.style'
import videoImg from '@/assets/video-example.png'
import tileImg from '@/assets/tile-example.png'

const SignInView = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [currentStepIdx, setCurrentStep] = useState(0)
  const browser = useCheckBrowser()

  const handleStepChange = (idx: number) => {
    if (idx < 0 || idx > steps.length - 1) {
      return
    }
    setCurrentStep(idx)
  }

  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <AddPolkaDot browser={browser} onStepChange={handleStepChange} currentStepIdx={currentStepIdx} />,
    },
    {
      title: 'Create or select a polkadot account',
      element: <CreateOrSelectAccount />,
    },
    {
      title: 'Get FREE tokens and start a channel',
      element: <TermsAndConditions />,
    },
  ]
  return (
    <SignInWrapper>
      <Header>
        <Text variant="h1">Start your Joystream channel for free!</Text>
        <SubTitle variant="h3">
          Joystream Studio is a space for Joystream Content Creators. Sign in and start publishing now!
        </SubTitle>
        <StyledBackgroundPattern />
        <ButtonGroup>
          <SignInButton onClick={() => setIsDialogVisible(true)} size="large">
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
      <Multistepper
        currentStepIdx={currentStepIdx}
        steps={steps}
        showDialog={isDialogVisible}
        onExitClick={() => setIsDialogVisible(false)}
      />
    </SignInWrapper>
  )
}

export default SignInView
