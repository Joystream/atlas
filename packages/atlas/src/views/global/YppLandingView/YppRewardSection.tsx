import { FC, useState } from 'react'

import { LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  BackgroundContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
  StyledLimitedWidthContainer,
} from './YppLandingView.styles'
import {
  BenefitsCardButton,
  BenefitsCardsButtonsGroup,
  BenefitsCardsContainerGridItem,
} from './YppRewardSection.styles'

export const YppRewardSection: FC = () => {
  const mdMatch = useMediaMatch('md')
  const [rewardMultiplier, setRewardMultiplier] = useState<1 | 1.5 | 3>(1)
  return (
    <BackgroundContainer pattern="top">
      <StyledLimitedWidthContainer as="section">
        <CenteredLayoutGrid>
          <HeaderGridItem as="header" colStart={{ sm: 3, lg: 4 }} colSpan={{ base: 12, sm: 8, lg: 6 }}>
            <Text variant={mdMatch ? 'h700' : 'h600'} as="h2">
              Get rewarded for performing simple tasks
            </Text>
            <Text variant="t300" as="p" margin={{ top: 4 }} color="colorText">
              Simple tasks, guaranteed payouts. The more popular your channel is, the higher the rewards.
            </Text>
          </HeaderGridItem>
        </CenteredLayoutGrid>

        <BenefitsCardsButtonsGroup>
          <BenefitsCardButton
            variant={rewardMultiplier === 1 ? 'primary' : 'tertiary'}
            onClick={() => setRewardMultiplier(1)}
          >
            &lt;5K subscribers
          </BenefitsCardButton>
          <BenefitsCardButton
            variant={rewardMultiplier === 1.5 ? 'primary' : 'tertiary'}
            onClick={() => setRewardMultiplier(1.5)}
          >
            &lt;5-25K subscribers (1.5x)
          </BenefitsCardButton>
          <BenefitsCardButton
            variant={rewardMultiplier === 3 ? 'primary' : 'tertiary'}
            onClick={() => setRewardMultiplier(3)}
          >
            &gt;25K subscribers (3x)
          </BenefitsCardButton>
        </BenefitsCardsButtonsGroup>

        <LayoutGrid>
          <BenefitsCardsContainerGridItem colStart={{ lg: 2 }} colSpan={{ base: 12, lg: 10 }}>
            <BenefitCard
              title="Authorize your YouTube channel"
              joyAmount={250 * rewardMultiplier}
              dollarAmount={0}
              variant="compact"
              description="Sign up for the program, connect your Atlas and YouTube channels via a simple step-by-step flow and get your first reward."
            />
            <BenefitCard
              title="Publish video on Atlas"
              joyAmount={120 * rewardMultiplier}
              dollarAmount={0}
              variant="compact"
              description="You can use your existing content and publish it on Atlas to earn."
            />
            <BenefitCard
              title="Share Atlas video on YouTube"
              joyAmount={190 * rewardMultiplier}
              dollarAmount={0}
              variant="compact"
              description="Tell your YouTube subscribers about your video on Atlas."
            />
            <BenefitCard
              title="Refer another YouTube creator"
              joyAmount={250 * rewardMultiplier}
              dollarAmount={0}
              variant="compact"
              description="Get JOY for recomendation of creator who signs up by your referal link"
            />
          </BenefitsCardsContainerGridItem>
        </LayoutGrid>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}
