import Multistepper from '@/components/Dialogs/Multistepper'
import { Button, Text } from '@/shared/components'
import React, { useState } from 'react'
import { AddPolkaDot, CreateOrSelectAccount, TermsAndConditions } from './SignInSteps'
import {
  StyledBackgroundPattern,
  SignInWrapper,
  SubTitle,
  ButtonGroup,
  SignInButton,
  HowItWorksButton,
  Tile,
  VideoImage,
} from './SignInView.style'

const SignInView = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <AddPolkaDot />,
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
      <header>
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
      </header>
      <div>
        <VideoImage />
        <Tile />
      </div>
      <Multistepper steps={steps} showDialog={isDialogVisible} onExitClick={() => setIsDialogVisible(false)} />
    </SignInWrapper>
  )
}

export default SignInView
