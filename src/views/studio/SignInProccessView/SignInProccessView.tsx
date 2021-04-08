import { Text } from '@/shared/components'
import React from 'react'
import {
  HeroContainer,
  ListContainer,
  OrderedItem,
  OrderedList,
  StyledButton,
  StyledCoinsIllustrations,
  StyledStudioContainer,
  UnOrderedItem,
  UnOrderedList,
} from './SignInProccessView.style'

const SignInProccessView = () => {
  return (
    <>
      <StyledStudioContainer>
        <HeroContainer>
          <Text variant="h2">How to start your publisher journey?</Text>
        </HeroContainer>
        <ListContainer>
          <OrderedList>
            <OrderedItem variant="h4" as="li">
              Install Polkadot extension
              <UnOrderedList>
                <UnOrderedItem secondary variant="body2" as="li">
                  Create a polkadot account
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Make your first transaction & join the blockchain
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Connect it to your joystream membership
                </UnOrderedItem>
              </UnOrderedList>
            </OrderedItem>
            <OrderedItem variant="h4" as="li">
              Create joystream membership account
              <UnOrderedList>
                <UnOrderedItem secondary variant="body2" as="li">
                  One Joystream membership allows you to create multiple channels
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Creating a membership is free!
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Membership never expires & there are no fees!
                </UnOrderedItem>
              </UnOrderedList>
            </OrderedItem>
            <OrderedItem variant="h4" as="li">
              Create your first channel
              <UnOrderedList>
                <UnOrderedItem secondary variant="body2" as="li">
                  Add unlimited content
                </UnOrderedItem>
                <UnOrderedItem secondary variant="body2" as="li">
                  Gather your own audience & be heard!
                </UnOrderedItem>
              </UnOrderedList>
            </OrderedItem>
            <OrderedItem variant="h4" as="li">
              Publish your content on Joystream
            </OrderedItem>
          </OrderedList>
          <StyledButton size="large" icon="chevron-right">
            Join now
          </StyledButton>
        </ListContainer>
      </StyledStudioContainer>
      <StyledCoinsIllustrations />
    </>
  )
}

export default SignInProccessView
