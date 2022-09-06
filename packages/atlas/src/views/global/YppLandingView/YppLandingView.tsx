import { FC } from 'react'

import hero576 from '@/assets/images/ypp-hero/hero-576.webp'
import hero864 from '@/assets/images/ypp-hero/hero-864.webp'
import hero1152 from '@/assets/images/ypp-hero/hero-1152.webp'
import hero2304 from '@/assets/images/ypp-hero/hero-2304.webp'
import yt576 from '@/assets/images/ypp-hero/yt-576.webp'
import yt864 from '@/assets/images/ypp-hero/yt-864.webp'
import yt1152 from '@/assets/images/ypp-hero/yt-1152.webp'
import yt2304 from '@/assets/images/ypp-hero/yt-2304.webp'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronR } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import useScrollPosition from '@/hooks/useScrollPosition'

import { BackImage, FrontImage, HeroImageWrapper, StyledLimitedWidthContainer } from './YppLandingView.styles'

export const YppLandingView: FC = () => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const frontImagePosition = useScrollPosition(smMatch ? 0.2 : 0.1)

  return (
    <StyledLimitedWidthContainer>
      <LayoutGrid>
        <GridItem as="header" colSpan={{ base: 12, sm: 8, lg: 6 }} colStart={{ sm: 3, lg: 4 }}>
          <Text as="h1" variant={mdMatch ? 'h800' : 'h600'}>
            Connect your YouTube channel & get paid
          </Text>
          <Text as="p" variant="t300" color="colorText" margin={{ top: 4, bottom: 8 }}>
            Reupload and backup your YouTube videos to receive a guaranteed payout in the YouTube Partner Program.
          </Text>
          <Button size="large" icon={<SvgActionChevronR />} iconPlacement="right">
            Sign up now
          </Button>
          <Text as="p" variant="t100" color="colorText" margin={{ top: 2 }}>
            It takes 3 minutes and is 100% free.
          </Text>
        </GridItem>
      </LayoutGrid>
      <HeroImageWrapper>
        <BackImage srcSet={`${yt576} 576w, ${yt864} 864w, ${yt1152} 1152w, ${yt2304} 2304w`} alt="Hero back" />
        <FrontImage
          srcSet={`${hero576} 576w, ${hero864} 864w, ${hero1152} 1152w, ${hero2304} 2304w`}
          alt="Hero front"
          parallaxPosition={frontImagePosition}
        />
      </HeroImageWrapper>
    </StyledLimitedWidthContainer>
  )
}
