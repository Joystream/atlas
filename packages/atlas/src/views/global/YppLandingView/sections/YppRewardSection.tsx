import { FC, useRef } from 'react'

import { Information } from '@/components/Information'
import { FlexGridItem, GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { TooltipText } from '@/components/Tooltip/Tooltip.styles'
import { TierCard } from '@/components/_ypp/TierCard'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

import { ColorAnchor } from './YppRewardSection.styles'

import {
  BackgroundContainer,
  CenteredLayoutGrid,
  StyledLimitedWidthContainer,
  TierCardWrapper,
} from '../YppLandingView.styles'

export const calculateReward = (
  amount: number | number[] | { min: number | null; max: number } | null,
  multiplier: number | number[],
  tier: number
) => {
  if (amount === null) {
    return null
  } else if (typeof amount === 'number') {
    return {
      type: 'number' as const,
      amount: amount * (typeof multiplier === 'number' ? multiplier : multiplier[tier]),
    }
  } else if (Array.isArray(amount)) {
    return {
      type: 'number' as const,
      amount: amount[tier],
    }
  } else {
    return { type: 'range' as const, min: amount.min, max: amount.max }
  }
}

export const YppRewardSection: FC = () => {
  const mdMatch = useMediaMatch('md')
  const tiers = atlasConfig.features.ypp.tiersDefinition
  const [titleVariant, subtitleVariant] = useSectionTextVariants()
  const ref = useRef<HTMLDivElement>(null)

  if (!tiers?.length) {
    return null
  }

  return (
    <BackgroundContainer noBackground>
      <StyledLimitedWidthContainer as="section">
        <CenteredLayoutGrid>
          <GridItem colSpan={{ base: 12, sm: 10, md: 12, lg: 8 }} colStart={{ sm: 2, md: 1, lg: 3 }}>
            <Text
              variant={titleVariant}
              as="h2"
              data-aos="fade-up"
              data-aos-delay="0"
              data-aos-offset="80"
              data-aos-easing="atlas-easing"
            >
              Rewards based on quality and popularity
            </Text>
          </GridItem>
          <FlexGridItem colSpan={{ base: 12, sm: 10, md: 8, lg: 6 }} colStart={{ sm: 2, md: 3, lg: 4 }}>
            <Text
              variant={subtitleVariant}
              as="p"
              margin={{ top: 4, bottom: mdMatch ? 16 : 12 }}
              color="colorText"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Each participating channel is reviewed by the verification team and assigned to one of the reward tiers
              below
            </Text>
          </FlexGridItem>
        </CenteredLayoutGrid>
        <LayoutGrid>
          <TierCardWrapper colSpan={{ base: 12, sm: 10, md: 12, lg: 10 }} colStart={{ sm: 2, md: 1, lg: 2 }}>
            {tiers.map((tier) => {
              const [maxReferralReward] = tiers[tiers.length - 1].rewards.slice(-1)
              tier.rewards = [...tier.rewards.slice(0, -1), maxReferralReward]
              return <TierCard key={tier.tier} {...tier} />
            })}
          </TierCardWrapper>
          <FlexGridItem
            colSpan={{ base: 12, sm: 10, md: 12, lg: 10 }}
            colStart={{ sm: 2, md: 1, lg: 2 }}
            alignItems="center"
            marginTop={mdMatch ? -2 : 0}
            justifyContent="start"
          >
            <Text variant="t200" as="p" color="colorTextMuted">
              *Referral rewards depend on the tier of the invited channel. Referrer gets half of the sign up rewards for
              invited channels that are verified.
            </Text>
          </FlexGridItem>
          <FlexGridItem
            colSpan={{ base: 12, sm: 10, md: 12, lg: 10 }}
            colStart={{ sm: 2, md: 1, lg: 2 }}
            alignItems="center"
            marginTop={mdMatch ? -2 : 0}
            justifyContent="end"
          >
            <Text variant="t200" as="p" color="colorText">
              Payments are made in {atlasConfig.joystream.tokenTicker} tokens
            </Text>
            <Information
              interactive
              customContent={
                <TooltipText as="span" variant="t100">
                  {atlasConfig.joystream.tokenTicker} token is a native crypto asset of Joystream blockchain. It is used
                  for platform governance, purchasing NFTs, trading creator tokens, and covering blockchain processing
                  fees. They are listed on{' '}
                  <ColorAnchor href="https://www.mexc.com/exchange/JOYSTREAM_USDT" target="__blank">
                    MEXC
                  </ColorAnchor>{' '}
                  exchange under "JOYSTREAM" ticker.
                </TooltipText>
              }
              multiline
              reference={ref.current}
            />
          </FlexGridItem>
        </LayoutGrid>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}
