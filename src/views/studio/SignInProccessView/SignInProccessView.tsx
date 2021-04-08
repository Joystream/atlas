import { StudioContainer } from '@/components'
import { Button, Text } from '@/shared/components'
import React from 'react'
import { ReactComponent as CoinsIllustration } from '@/assets/coins.svg'

const SignInProccessView = () => {
  return (
    <>
      <StudioContainer>
        <div>
          <Text variant="hero">How to start your publisher journey</Text>
        </div>
        <div>
          <ol>
            <li>
              Install Polkadot extension
              <ul>
                <li>Create a polkadot account</li>
                <li>Make your first transaction & join the blockchain</li>
                <li>Connect it to your joystream membership</li>
              </ul>
            </li>
            <li>
              Create joystream membership account
              <ul>
                <li>One Joystream membership allows you to create multiple channels</li>
                <li>Creating a membership is free!</li>
                <li>Membership never expires & there are no fees!</li>
              </ul>
            </li>
            <li>
              Create your first channel
              <ul>
                <li>Add unlimited content</li>
                <li>Gather your own audience & be heard!</li>
              </ul>
            </li>
            <li>Publish your content on Joystream</li>
          </ol>
          <Button size="large" icon="chevron-right">
            Join now
          </Button>
        </div>
      </StudioContainer>
      <CoinsIllustration />
    </>
  )
}

export default SignInProccessView
