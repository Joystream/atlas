import { useRef } from 'react'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import {
  GradientOverlay,
  StyledLink,
  StyledVideo,
  StyledVideoWrapper,
} from '@/views/global/ReferralsView/ReferralsView.styles'
import { LogosContainer } from '@/views/global/YppLandingView/sections/YppHero.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const ReferralsVideo = () => {
  const [_, subtitleVariant, mainTitleVariant] = useSectionTextVariants()

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const smMatch = useMediaMatch('sm')

  return (
    <FlexBox flow="column" gap={smMatch ? 14 : 12}>
      <LayoutGrid as="header">
        <GridItem colSpan={{ base: 12, lg: 8 }} colStart={{ lg: 3 }}>
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
            margin={{ top: smMatch ? 14 : 8 }}
            variant={mainTitleVariant}
            data-aos="fade-up"
            data-aos-delay="250"
            data-aos-offset="80"
            data-aos-easing="atlas-easing"
          >
            Earn by Referring
          </Text>
        </GridItem>
        <GridItem colSpan={{ base: 12, sm: 10, lg: 6 }} colStart={{ sm: 2, lg: 4 }}>
          <Text
            as="p"
            variant={subtitleVariant}
            color="colorText"
            data-aos="fade-up"
            data-aos-delay="350"
            data-aos-offset="40"
            data-aos-easing="atlas-easing"
          >
            Referrals rewards is the biggest source of earnings for {atlasConfig.general.appName} creators participating
            in our <StyledLink to={absoluteRoutes.viewer.ypp()}>YouTube Partnership Program</StyledLink>
          </Text>
        </GridItem>
      </LayoutGrid>
      <LayoutGrid>
        <GridItem colSpan={{ base: 12, lg: 10 }} colStart={{ lg: 2 }}>
          <StyledVideoWrapper>
            <StyledVideo ref={videoRef} autoPlay loop muted playsInline>
              <source
                src="https://eu-central-1.linodeobjects.com/atlas-assets/categories/gleev/videos/referrals/Referrals_dashboard.mp4"
                type="video/mp4"
              />
            </StyledVideo>
            <GradientOverlay />
          </StyledVideoWrapper>
        </GridItem>
      </LayoutGrid>
    </FlexBox>
  )
}
