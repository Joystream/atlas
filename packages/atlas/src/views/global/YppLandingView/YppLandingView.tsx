import { FC } from 'react'

import hero576 from '@/assets/images/ypp-hero/hero-576.webp'
import hero864 from '@/assets/images/ypp-hero/hero-864.webp'
import hero1152 from '@/assets/images/ypp-hero/hero-1152.webp'
import yt328 from '@/assets/images/ypp-hero/yt-328.webp'
import yt614 from '@/assets/images/ypp-hero/yt-614.webp'
import yt740 from '@/assets/images/ypp-hero/yt-740.webp'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronR } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import useScrollPosition from '@/hooks/useScrollPosition'

import { BackImage, FrontImage, HeroWrapper, Wrapper } from './YppLandingView.styles'

export const YppLandingView: FC = () => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const frontImagePosition = useScrollPosition(smMatch ? 0.2 : 0.1)

  return (
    <Wrapper>
      <LimitedWidthContainer>
        <LayoutGrid>
          <GridItem colSpan={{ base: 12, sm: 8, lg: 6 }} colStart={{ sm: 3, lg: 4 }}>
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
      </LimitedWidthContainer>
      <HeroWrapper>
        <BackImage srcSet={`${yt328} 328w, ${yt614} 614w, ${yt740} 740w`} alt="Hero image back" />
        <FrontImage
          srcSet={`${hero576} 576w, ${hero864} 864w, ${hero1152} 1152w`}
          alt="Hero image front"
          parallaxPosition={frontImagePosition}
        />
      </HeroWrapper>
    </Wrapper>
  )
}
