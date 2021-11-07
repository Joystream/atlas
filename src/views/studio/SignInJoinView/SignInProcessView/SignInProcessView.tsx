import React from 'react'

import { SignInStepsStepper } from '@/components/SignInSteps'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { SvgGlyphChevronRight } from '@/icons'

import {
  HeroContainer,
  ListContainer,
  OrderedItem,
  OrderedList,
  StyledButton,
  StyledCoinsIllustrations,
  StyledStudioContainer,
  SubTitle,
  UnOrderedItem,
  UnOrderedList,
} from './SignInProcessView.style'

export const SignInProcessView = () => {
  return (
    <>
      <StyledStudioContainer>
        <HeroContainer>
          <Text variant="h2">How to start your publisher journey?</Text>
          <SubTitle variant="body1" secondary>
            We will guide you through those steps so you&apos;re all set up to start publishing on Joystream.
          </SubTitle>
        </HeroContainer>
        <ListContainer>
          <OrderedList>
            <OrderedItem variant="h4" as="li">
              Create your blockchain account
              <UnOrderedList>
                <UnOrderedItem secondary variant="body2" as="li">
                  Install Polkadot browser extension
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Generate your personal keypair
                </UnOrderedItem>
              </UnOrderedList>
            </OrderedItem>
            <OrderedItem variant="h4" as="li">
              Create Joystream membership
              <UnOrderedList>
                <UnOrderedItem secondary variant="body2" as="li">
                  One Joystream membership allows you to create multiple channels
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Creating a membership is free
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Membership never expires & there are no fees
                </UnOrderedItem>
              </UnOrderedList>
            </OrderedItem>
            <OrderedItem variant="h4" as="li">
              Create your channel
              <UnOrderedList>
                <UnOrderedItem secondary variant="body2" as="li">
                  Personalize your channel
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Gather your own audience & be heard
                </UnOrderedItem>
              </UnOrderedList>
            </OrderedItem>
            <OrderedItem variant="h4" as="li">
              Publish your content on Joystream
            </OrderedItem>
          </OrderedList>
          <StyledButton
            size="large"
            icon={<SvgGlyphChevronRight />}
            to={absoluteRoutes.studio.signInJoin({ step: '1' })}
          >
            Get started
          </StyledButton>
        </ListContainer>
      </StyledStudioContainer>
      <StyledCoinsIllustrations />
      <SignInStepsStepper />
    </>
  )
}
