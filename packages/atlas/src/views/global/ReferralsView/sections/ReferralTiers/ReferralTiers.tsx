import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { TierCard } from '@/components/_referrals/TierCard'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import {
  AvatarWrapper,
  StyledSideLine,
  StyledTierCardsWrapper,
  StyledVertLine,
  TiersGraphicWrapper,
} from '@/views/global/ReferralsView/sections/ReferralTiers/ReferralTiers.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const ReferralTiers = () => {
  const [titleVariant, subtitleVariant, _] = useSectionTextVariants()
  const smMatch = useMediaMatch('sm')
  const lgMatch = useMediaMatch('lg')

  const tiers = atlasConfig.features.ypp.tiersDefinition
  return (
    <FlexBox flow="column">
      <LayoutGrid as="header">
        <GridItem colSpan={{ base: 12, sm: 8, md: 12, lg: 8 }} colStart={{ sm: 3, md: 1, lg: 3 }}>
          <Text
            as="h2"
            variant={titleVariant}
            data-aos="fade-up"
            data-aos-delay="250"
            data-aos-offset="80"
            data-aos-easing="atlas-easing"
          >
            How much you can earn?
          </Text>
        </GridItem>
        <GridItem colSpan={{ base: 12, sm: 8, lg: 6 }} colStart={{ base: 1, sm: 3, lg: 4 }}>
          <Text
            as="p"
            variant={subtitleVariant}
            color="colorText"
            margin={{ bottom: lgMatch ? 18 : smMatch ? 14 : 12 }}
            data-aos="fade-up"
            data-aos-delay="350"
            data-aos-offset="40"
            data-aos-easing="atlas-easing"
          >
            Earnings are unlimited and you receive rewards for each referred channel based on the YPP tier assigned to
            them by the verification team.
          </Text>
        </GridItem>
      </LayoutGrid>
      <TiersGraphicWrapper>
        <StyledSideLine isRight={false} />
        <AvatarWrapper size={88}>
          <Avatar size={88} />
        </AvatarWrapper>
        <StyledVertLine />
        <StyledSideLine isRight={true} />
      </TiersGraphicWrapper>
      <LayoutGrid as="section">
        <GridItem colSpan={{ base: 12, lg: 10 }} colStart={{ lg: 2 }}>
          <StyledTierCardsWrapper>
            {tiers.map((tier) => (
              <TierCard key={tier.tier} {...tier} />
            ))}
          </StyledTierCardsWrapper>
        </GridItem>
      </LayoutGrid>
    </FlexBox>
  )
}
