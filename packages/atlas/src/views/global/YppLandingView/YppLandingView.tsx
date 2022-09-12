import { FC } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'

import { LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import {
  BackgroundContainer,
  BenefitsCardsContainerGridItem,
  CardsLimitedWidtContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
} from './YppLandingView.styles'
import { YppThreeStepsSection } from './YppThreeStepsSection'

export const YppLandingView: FC = () => {
  const mdMatch = useMediaMatch('md')
  const headTags = useHeadTags('Youtube Partner Program')
  return (
    <>
      {headTags}
      <ParallaxProvider>
        <YppHero />
        <BackgroundContainer pattern="top">
          <CardsLimitedWidtContainer as="section">
            <CenteredLayoutGrid>
              <HeaderGridItem
                marginBottom={8}
                as="header"
                colStart={{ sm: 3, lg: 4 }}
                colSpan={{ base: 12, sm: 8, lg: 6 }}
              >
                <Text variant={mdMatch ? 'h700' : 'h600'} as="h2">
                  Get rewarded for performing simple tasks
                </Text>
                <Text variant="t300" as="p" margin={{ top: 4, bottom: 8 }} color="colorText">
                  Simple tasks, guaranteed payouts. The more popular your channel is, the higher the rewards.
                </Text>
              </HeaderGridItem>
            </CenteredLayoutGrid>
            <LayoutGrid>
              <BenefitsCardsContainerGridItem colStart={{ lg: 2 }} colSpan={{ base: 12, lg: 10 }}>
                <BenefitCard
                  title="Authorize your YouTube channel"
                  joyAmount={250}
                  dollarAmount={0}
                  variant="compact"
                  description="Sign up for the program, connect your Atlas and YouTube channels via a simple step-by-step flow and get your first reward."
                />
                <BenefitCard
                  title="Publish video on Atlas"
                  joyAmount={120}
                  dollarAmount={0}
                  variant="compact"
                  description="You can use your existing content and publish it on Atlas to earn."
                />
                <BenefitCard
                  title="Share Atlas video on YouTube"
                  joyAmount={190}
                  dollarAmount={0}
                  variant="compact"
                  description="Tell your YouTube subscribers about your video on Atlas."
                />
                <BenefitCard
                  title="Refer another YouTube creator"
                  joyAmount={250}
                  dollarAmount={0}
                  variant="compact"
                  description="Get JOY for recomendation of creator who signs up by your referal link"
                />
              </BenefitsCardsContainerGridItem>
            </LayoutGrid>
          </CardsLimitedWidtContainer>
        </BackgroundContainer>
        <YppThreeStepsSection />
        <YppCardsSections />
        <YppFooter />
      </ParallaxProvider>
    </>
  )
}
