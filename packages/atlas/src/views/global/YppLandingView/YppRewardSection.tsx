import { FC, useState } from 'react'

import { LayoutGrid } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { atlasConfig } from '@/config'
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
  const tiers = atlasConfig.features.ypp.tiersDefinition?.tiers
  const rewards = atlasConfig.features.ypp.rewards
  const [rewardMultiplier, setRewardMultiplier] = useState<number>(tiers ? tiers[tiers.length - 1].multiplier : 1)

  if (!rewards?.length) {
    return null
  }

  return (
    <BackgroundContainer pattern="top">
      <StyledLimitedWidthContainer as="section">
        <CenteredLayoutGrid>
          <HeaderGridItem as="header" colStart={{ sm: 3, lg: 4 }} colSpan={{ base: 12, sm: 8, lg: 6 }}>
            <Text
              variant={mdMatch ? 'h700' : 'h600'}
              as="h2"
              data-aos="fade-up"
              data-aos-delay="0"
              data-aos-offset="80"
              data-aos-easing="atlas-easing"
            >
              Get rewarded for performing simple tasks
            </Text>
            <Text
              variant="t300"
              as="p"
              margin={{ top: 4 }}
              color="colorText"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Simple tasks, guaranteed payouts. The more popular your channel is, the higher the rewards.
            </Text>
          </HeaderGridItem>
        </CenteredLayoutGrid>

        {tiers && (
          <BenefitsCardsButtonsGroup
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-offset="80"
            data-aos-easing="atlas-easing"
          >
            {tiers.map((tier, idx, tierArray) => {
              const isFirstTier = idx === 0
              const isLastTier = idx === tierArray.length - 1
              if (isFirstTier) {
                return (
                  <BenefitsCardButton
                    variant={rewardMultiplier === tier.multiplier ? 'primary' : 'tertiary'}
                    key={tier.minimumSubscribers}
                    onClick={() => setRewardMultiplier(tier.multiplier)}
                  >
                    &lt;
                    <NumberFormat
                      as="span"
                      format="short"
                      color="colorTextStrong"
                      variant="h300"
                      value={tierArray[idx + 1].minimumSubscribers}
                    />{' '}
                    subscribers
                  </BenefitsCardButton>
                )
              }
              if (isLastTier) {
                return (
                  <BenefitsCardButton
                    variant={rewardMultiplier === tier.multiplier ? 'primary' : 'tertiary'}
                    key={tier.minimumSubscribers}
                    onClick={() => setRewardMultiplier(tier.multiplier)}
                  >
                    &gt;
                    <NumberFormat
                      as="span"
                      format="short"
                      color="colorTextStrong"
                      variant="h300"
                      value={tier.minimumSubscribers}
                    />{' '}
                    subscribers
                  </BenefitsCardButton>
                )
              }
              return (
                <BenefitsCardButton
                  variant={rewardMultiplier === tier.multiplier ? 'primary' : 'tertiary'}
                  key={tier.minimumSubscribers}
                  onClick={() => setRewardMultiplier(tier.multiplier)}
                >
                  <NumberFormat
                    as="span"
                    format="short"
                    color="colorTextStrong"
                    variant="h300"
                    value={tier.minimumSubscribers}
                  />
                  -
                  <NumberFormat
                    as="span"
                    format="short"
                    color="colorTextStrong"
                    variant="h300"
                    value={tierArray[idx + 1].minimumSubscribers}
                  />{' '}
                  subscribers
                </BenefitsCardButton>
              )
            })}
          </BenefitsCardsButtonsGroup>
        )}
        <LayoutGrid data-aos="fade-up" data-aos-delay="200" data-aos-offset="80" data-aos-easing="atlas-easing">
          <BenefitsCardsContainerGridItem colStart={{ lg: 2 }} colSpan={{ base: 12, lg: 10 }}>
            {rewards.map((reward) => {
              const rewardAmount =
                typeof reward.baseAmount === 'number'
                  ? { type: 'number' as const, amount: reward.baseAmount * rewardMultiplier }
                  : { type: 'range' as const, min: reward.baseAmount.min, max: reward.baseAmount.max }
              return (
                <BenefitCard
                  key={reward.title}
                  title={reward.title}
                  joyAmount={null}
                  dollarAmount={rewardAmount}
                  variant="compact"
                  description={reward.shortDescription}
                />
              )
            })}
          </BenefitsCardsContainerGridItem>
        </LayoutGrid>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}
