import Multistepper from '@/components/Dialogs/Multistepper'
import { useCheckBrowser } from '@/hooks'
import { Text } from '@/shared/components'
import React, { useState } from 'react'
import { ExtensionStep, AccountStep, TermsStep } from './Steps'
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
import { css } from '@emotion/react'
import { colors } from '@/shared/theme'
import AddMemberView from './AddMemberView/AddMemberView'

const SignInView = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [currentStepIdx, setCurrentStep] = useState(0)
  const browser = useCheckBrowser()

  const handleStepChange = (idx: number) => {
    if (idx < 0 || idx > steps.length) {
      return
    }
    setCurrentStep(idx)
  }

  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <ExtensionStep browser={browser} onStepChange={handleStepChange} currentStepIdx={currentStepIdx} />,
    },
    {
      title: 'Create or select a polkadot account',
      element: <AccountStep onStepChange={handleStepChange} currentStepIdx={currentStepIdx} />,
    },
    {
      title: 'Accept terms and conditions',
      element: <TermsStep onStepChange={handleStepChange} currentStepIdx={currentStepIdx} />,
    },
  ]

  const handleCloseDialog = () => {
    setIsDialogVisible(false)
    setCurrentStep(0)
  }
  return (
    <>
      {currentStepIdx < 3 ? (
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
            css={css`
              background-color: ${colors.gray[700]};
            `}
            currentStepIdx={currentStepIdx}
            steps={steps}
            showDialog={isDialogVisible}
            onExitClick={handleCloseDialog}
          />
        </SignInWrapper>
      ) : (
        <AddMemberView />
      )}
    </>
  )
}

export default SignInView
