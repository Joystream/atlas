import { SvgActionChevronR } from '@/assets/icons'
import createMember from '@/assets/images/create-membership.webp'
import memberDropdown from '@/assets/images/member-dropdown.webp'
import selectChannel from '@/assets/images/select-channel.webp'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  BackgroundContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
  StyledLimitedWidthContainer,
} from './YppLandingView.styles'
import { StepCard, StepCardFade, StepCardImg, StepCardNumber, StepCardsWrapper } from './YppThreeStepsSection.styles'

export const YppThreeStepsSection = () => {
  const mdMatch = useMediaMatch('md')
  return (
    <BackgroundContainer pattern="bottom">
      <StyledLimitedWidthContainer as="section">
        <CenteredLayoutGrid>
          <HeaderGridItem marginBottom={8} as="header" colStart={{ sm: 3, lg: 4 }} colSpan={{ base: 12, sm: 8, lg: 6 }}>
            <Text
              variant={mdMatch ? 'h700' : 'h600'}
              as="h2"
              data-aos="fade-up"
              data-aos-delay="0"
              data-aos-offset="80"
              data-aos-easing="atlas-easing"
            >
              Get started in 3 steps
            </Text>
            <Text
              variant="t300"
              as="p"
              margin={{ top: 4, bottom: 8 }}
              color="colorText"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Our fully automated verification process is as simple as 1-2-3. If you don't have an Atlas channel
              already, you'll be able to create one for free.
            </Text>
            <Button
              size="large"
              iconPlacement="right"
              icon={<SvgActionChevronR />}
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Sign up now
            </Button>
            <Text
              variant="t100"
              as="p"
              color="colorTextMuted"
              margin={{ top: 2 }}
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              It takes 3 minutes and is 100% free.
            </Text>
          </HeaderGridItem>
          <StepCardsWrapper
            colStart={{ lg: 2 }}
            colSpan={{ base: 12, lg: 10 }}
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-offset="80"
            data-aos-easing="atlas-easing"
          >
            <StepCard>
              <StepCardNumber>1</StepCardNumber>
              <Text variant={mdMatch ? 'h500' : 'h400'} as="h2">
                Create membership & channel
              </Text>
              <StepCardImg src={createMember} alt="Create member dialog step" width="322" height="468" />
              <StepCardFade />
            </StepCard>
            <StepCard>
              <StepCardNumber>2</StepCardNumber>
              <Text variant={mdMatch ? 'h500' : 'h400'} as="h2">
                Authorize your YouTube channel
              </Text>
              <StepCardImg src={selectChannel} alt="Select channel dialog step" width="322" height="468" />
              <StepCardFade />
            </StepCard>
            <StepCard>
              <StepCardNumber>3</StepCardNumber>
              <Text variant={mdMatch ? 'h500' : 'h400'} as="h2">
                Collect JOY tokens and access all Atlas features
              </Text>
              <StepCardImg src={memberDropdown} alt="Member dropdown" width="322" height="468" />
              <StepCardFade />
            </StepCard>
          </StepCardsWrapper>
        </CenteredLayoutGrid>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}
