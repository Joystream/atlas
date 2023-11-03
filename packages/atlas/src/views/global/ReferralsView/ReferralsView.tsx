import { useEffect, useRef } from 'react'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers/personalData'
import {
  GradientOverlay,
  StyledLink,
  StyledVideo,
  StyledVideoWrapper,
} from '@/views/global/ReferralsView/ReferralsView.styles'
import { ReferralLayers } from '@/views/global/ReferralsView/sections/ReferralLayers/ReferralLayers'
import { ReferralSteps } from '@/views/global/ReferralsView/sections/ReferralSteps/ReferralSteps'
import { ReferralTiers } from '@/views/global/ReferralsView/sections/ReferralTiers/ReferralTiers'
import { ReferralsList } from '@/views/global/ReferralsView/sections/ReferralsList/ReferralsList'
import { TopReferrals } from '@/views/global/ReferralsView/sections/TopReferrals/TopReferrals'
import { StyledLimitedWidthContainerHero } from '@/views/global/YppLandingView/YppLandingView.styles'
import { LogosContainer } from '@/views/global/YppLandingView/sections/YppHero.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const ReferralsView = () => {
  const [titleVariant, subtitleVariant, mainTitleVariant] = useSectionTextVariants()
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  useEffect(() => {
    updateDismissedMessages('referrals-banner')
  }, [updateDismissedMessages])

  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2
    }
  }, [])

  return (
    <FlexBox flow="column" justifyContent="center" alignItems="center" gap={4}>
      <StyledLimitedWidthContainerHero centerText>
        <LayoutGrid as="header">
          <GridItem colSpan={{ base: 12, sm: 10, md: 9, lg: 10 }} colStart={{ sm: 2, md: 3, lg: 2 }}>
            <LogosContainer>
              <AppLogo
                variant="full"
                height={32}
                width={undefined}
                data-aos="fade-up"
                data-aos-delay="150"
                data-aos-offset="120"
                data-aos-easing="atlas-easing"
              />
            </LogosContainer>
            <Text
              as="h1"
              variant={mainTitleVariant}
              data-aos="fade-up"
              data-aos-delay="250"
              data-aos-offset="80"
              data-aos-easing="atlas-easing"
            >
              Earn by Referring
            </Text>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 8, md: 7, lg: 6 }} colStart={{ sm: 3, md: 4, lg: 4 }}>
            <Text
              as="p"
              variant={subtitleVariant}
              color="colorText"
              margin={{ top: 4, bottom: 12 }}
              data-aos="fade-up"
              data-aos-delay="350"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Referrals rewards is the biggest source of earnings for {atlasConfig.general.appName} creators
              participating in our <StyledLink to={absoluteRoutes.viewer.ypp()}>YouTube Partnership Program</StyledLink>
            </Text>
          </GridItem>
        </LayoutGrid>
        <StyledVideoWrapper>
          <StyledVideo ref={videoRef} autoPlay loop muted>
            <source
              src="https://eu-central-1.linodeobjects.com/atlas-assets/categories/gleev/videos/referrals/Referrals_dashboard.mp4"
              type="video/mp4"
            />
          </StyledVideo>
          <GradientOverlay />
        </StyledVideoWrapper>
        <LayoutGrid as="header">
          <GridItem colSpan={{ base: 12 }} colStart={{ sm: 1, md: 1, lg: 1 }}>
            <Text
              margin={{ top: 16 }}
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
          <GridItem colSpan={{ base: 10, sm: 8, md: 6, lg: 6 }} colStart={{ base: 2, sm: 3, md: 4, lg: 4 }}>
            <Text
              as="p"
              variant={subtitleVariant}
              color="colorText"
              margin={{ top: 4, bottom: 12 }}
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
        <ReferralTiers />
        <ReferralLayers />
        <ReferralSteps />
        <TopReferrals />
        <ReferralsList />
      </StyledLimitedWidthContainerHero>
    </FlexBox>
  )
}
