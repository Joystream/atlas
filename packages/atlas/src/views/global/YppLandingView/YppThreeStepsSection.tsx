import createMember from '@/assets/images/create-membership.webp'
import memberDropdown from '@/assets/images/member-dropdown.webp'
import selectChannel from '@/assets/images/select-channel.webp'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronR } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  BackgroundContainer,
  CardsLimitedWidtContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
} from './YppLandingView.styles'
import { StepCard, StepCardFade, StepCardImg, StepCardNumber, StepCardsWrapper } from './YppThreeStepsSection.styles'

export const YppThreeStepsSection = () => {
  const mdMatch = useMediaMatch('md')
  return (
    <BackgroundContainer pattern="bottom">
      <CardsLimitedWidtContainer as="section">
        {/* TODO add reward section above */}
        <CenteredLayoutGrid>
          <HeaderGridItem marginBottom={8} as="header" colStart={{ sm: 3, lg: 4 }} colSpan={{ base: 12, sm: 8, lg: 6 }}>
            <Text variant={mdMatch ? 'h700' : 'h600'} as="h2">
              Get started in 3 steps
            </Text>
            <Text variant="t300" as="p" margin={{ top: 4, bottom: 8 }} color="colorText">
              Our fully automated verification process is as simple as 1-2-3. If you don't have an Atlas channel
              already, you'll be able to create one for free.
            </Text>
            <Button size="large" iconPlacement="right" icon={<SvgActionChevronR />}>
              Sign up now
            </Button>
            <Text variant="t100" as="p" color="colorTextMuted" margin={{ top: 2 }}>
              It takes 3 minutes and is 100% free.
            </Text>
          </HeaderGridItem>
          <StepCardsWrapper colStart={{ lg: 2 }} colSpan={{ base: 12, lg: 10 }}>
            <StepCard>
              <StepCardNumber>1</StepCardNumber>
              <Text variant={mdMatch ? 'h500' : 'h400'} as="h2">
                Create membership & channel
              </Text>
              <StepCardImg src={createMember} alt="Create member dialog step" />
              <StepCardFade />
            </StepCard>
            <StepCard>
              <StepCardNumber>2</StepCardNumber>
              <Text variant={mdMatch ? 'h500' : 'h400'} as="h2">
                Authorize your YouTube channel
              </Text>
              <StepCardImg src={selectChannel} alt="Select channel dialog step" />
              <StepCardFade />
            </StepCard>
            <StepCard>
              <StepCardNumber>3</StepCardNumber>
              <Text variant={mdMatch ? 'h500' : 'h400'} as="h2">
                Collect JOY tokens and access all Atlas features
              </Text>
              <StepCardImg src={memberDropdown} alt="Member dropdown" />
              <StepCardFade />
            </StepCard>
          </StepCardsWrapper>
        </CenteredLayoutGrid>
      </CardsLimitedWidtContainer>
    </BackgroundContainer>
  )
}
