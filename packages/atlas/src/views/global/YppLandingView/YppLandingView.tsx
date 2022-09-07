import { FC } from 'react'
import { useParallax } from 'react-scroll-parallax'

import myVideosBack from '@/assets/images/illustration-my-videos-page-l1.webp'
import myVideosFront from '@/assets/images/illustration-my-videos-page-l2.webp'
import dashboardImgBack from '@/assets/images/illustration-ypp-dashboard-l1.webp'
import dashboardImgFront from '@/assets/images/illustration-ypp-dashboard-l2.webp'
import youtubeSyncBack from '@/assets/images/illustration-ypp-sync-l1.webp'
import youtubeSyncFront from '@/assets/images/illustration-ypp-sync-l2.webp'
import hero576 from '@/assets/images/ypp-hero/hero-576.webp'
import hero864 from '@/assets/images/ypp-hero/hero-864.webp'
import hero1152 from '@/assets/images/ypp-hero/hero-1152.webp'
import hero2304 from '@/assets/images/ypp-hero/hero-2304.webp'
import yt576 from '@/assets/images/ypp-hero/yt-576.webp'
import yt864 from '@/assets/images/ypp-hero/yt-864.webp'
import yt1152 from '@/assets/images/ypp-hero/yt-1152.webp'
import yt2304 from '@/assets/images/ypp-hero/yt-2304.webp'
import { ContentCard } from '@/components/ContentCard'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronR } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  AbsolutelyPositionedImg,
  BackImage,
  CardImageRow,
  FrontImage,
  HeroGridItem,
  HeroImageWrapper,
  ImageContainer,
  RelativelyPositionedImg,
  StyledLimitedWidthContainer,
  YppProgramContanerGrid,
} from './YppLandingView.styles'

export const YppLandingView: FC = () => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const { ref: frontImageRef } = useParallax<HTMLImageElement>({
    startScroll: 0,
    endScroll: smMatch ? window.innerHeight / 3 : window.innerHeight,
    translateY: [0, -15],
  })
  return (
    <>
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
            ref={frontImageRef}
            srcSet={`${hero576} 576w, ${hero864} 864w, ${hero1152} 1152w, ${hero2304} 2304w`}
            alt="Hero front"
          />
        </HeroImageWrapper>
      </StyledLimitedWidthContainer>
      <YppProgramContanerGrid as="section">
        <HeroGridItem as="header" colStart={{ sm: 3, lg: 4 }} colSpan={{ base: 12, sm: 8, lg: 6 }}>
          <Text variant={mdMatch ? 'h800' : 'h600'} as="h2">
            Get started in 3 steps
          </Text>
          <Text variant="t300" as="p" margin={{ top: 4, bottom: 8 }} color="colorText">
            Our fully automated verification process is as simple as 1-2-3. If you don't have an Atlas channel already,
            you'll be able to create one for free.{' '}
          </Text>
          <Button size="large" iconPlacement="right" icon={<SvgActionChevronR />}>
            Sign up now
          </Button>
          <Text variant="t100" as="p" color="colorTextMuted" margin={{ top: 2 }}>
            It takes 3 minutes and is 100% free.
          </Text>
        </HeroGridItem>
      </YppProgramContanerGrid>
      <YppProgramContanerGrid as="section">
        <HeroGridItem as="header" colStart={{ sm: 3, lg: 4 }} colSpan={{ base: 12, sm: 8, lg: 6 }}>
          <Text variant={mdMatch ? 'h800' : 'h600'} as="h2">
            There is more to Youtube Partner Program
          </Text>
          <Text variant="t300" as="p" margin={{ top: 4 }} color="colorText">
            New to Atlas? Joining our YouTube Partner Program is an exciting opportunity to try out the future of online
            video sharing. And we're only getting started.
          </Text>
        </HeroGridItem>
      </YppProgramContanerGrid>
      <LayoutGrid>
        <CardImageRow colSpan={{ base: 12 }}>
          <ImageContainer>
            <AbsolutelyPositionedImg src={dashboardImgBack} />
            <RelativelyPositionedImg src={dashboardImgFront} />
          </ImageContainer>

          <ContentCard
            title="Manage your channel on a simple dashboard"
            subtitle="YPP dashboard"
            body="There you can check your channel status and get instructions on completing all actions to get rewards"
          />
        </CardImageRow>
        <CardImageRow colSpan={{ base: 12, md: 10 }} colStart={{ md: 2 }}>
          <ImageContainer positionOnMobile="flex-end">
            <AbsolutelyPositionedImg src={myVideosBack} stickToRightSideOnMobile />
            <RelativelyPositionedImg src={myVideosFront} stickToRightSideOnMobile />
          </ImageContainer>
          <ContentCard
            title="Backup your videos and own them forever"
            subtitle="YouTube backup"
            body="You can sleep peacefully knowing that your conent is safe and forever stored on blockchain. You can even sell it as NFTs — you own it forever."
          />
        </CardImageRow>
        <CardImageRow colSpan={{ base: 12 }}>
          <ImageContainer positionOnMobile="center">
            <AbsolutelyPositionedImg src={youtubeSyncBack} />
            <RelativelyPositionedImg src={youtubeSyncFront} />
          </ImageContainer>
          <ContentCard
            pill={{
              label: 'Coming later this year',
            }}
            title="Automatic YouTube video sync"
            subtitle="YouTube sync"
            body="Set up once and do nothing. Your videos will be automaticly synced from youtube to Atlas and you will still earn for it passively."
          />
        </CardImageRow>
      </LayoutGrid>
    </>
  )
}
