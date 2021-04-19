import { Multistepper, ExtensionStep, AccountStep, TermsStep } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { useRouterQuery } from '@/hooks'
import { Text } from '@/shared/components'
import { SvgGlyphChevronRight } from '@/shared/icons'
import React from 'react'
import { useNavigate } from 'react-router'

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
  const navigate = useNavigate()
  const step = Number(useRouterQuery('step'))

  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <ExtensionStep nextStepPath={absoluteRoutes.studio.signInJoin({ step: '2' })} />,
    },
    {
      title: 'Create or select a polkadot account',
      element: <AccountStep nextStepPath={absoluteRoutes.studio.signInJoin({ step: '3' })} />,
    },
    {
      title: 'Accept terms and conditions',
      element: <TermsStep />,
    },
  ]
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
          <StyledButton
            size="large"
            icon={<SvgGlyphChevronRight />}
            to={absoluteRoutes.studio.signInJoin({ step: '1' })}
          >
            Join now
          </StyledButton>
        </ListContainer>
      </StyledStudioContainer>
      <StyledCoinsIllustrations />
      <Multistepper
        currentStepIdx={step <= 0 ? 0 : step - 1}
        steps={steps}
        showDialog={step >= 1}
        onExitClick={() => navigate(absoluteRoutes.studio.signInJoin({ step: '0' }))}
      />
    </>
  )
}

export default SignInProccessView
