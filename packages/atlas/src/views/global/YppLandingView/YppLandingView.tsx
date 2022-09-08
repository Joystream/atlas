import { FC } from 'react'
import { useParallax } from 'react-scroll-parallax'

import createMember from '@/assets/images/create-membership.webp'
import crt1 from '@/assets/images/illustration-crt-l1.webp'
import crt2 from '@/assets/images/illustration-crt-l2.webp'
import crt3 from '@/assets/images/illustration-crt-l3.webp'
import myVideosBack from '@/assets/images/illustration-my-videos-page-l1.webp'
import myVideosFront from '@/assets/images/illustration-my-videos-page-l2.webp'
import videoNfts1 from '@/assets/images/illustration-video-nfts-l1.webp'
import videoNfts2 from '@/assets/images/illustration-video-nfts-l2.webp'
import videoNfts3 from '@/assets/images/illustration-video-nfts-l3.webp'
import videoNfts4 from '@/assets/images/illustration-video-nfts-l4.webp'
import dashboardImgBack from '@/assets/images/illustration-ypp-dashboard-l1.webp'
import dashboardImgFront from '@/assets/images/illustration-ypp-dashboard-l2.webp'
import youtubeSyncBack from '@/assets/images/illustration-ypp-sync-l1.webp'
import youtubeSyncFront from '@/assets/images/illustration-ypp-sync-l2.webp'
import memberDropdown from '@/assets/images/member-dropdown.webp'
import selectChannel from '@/assets/images/select-channel.webp'
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
import { CallToActionButton } from '@/components/_buttons/CallToActionButton'
import { SvgActionChevronR, SvgActionInfo, SvgActionSpeech, SvgActionTokensStack } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  BackImage,
  BackgroundContainer,
  CardImage,
  CardImageRow,
  CardsWithImagesContainer,
  CenteredLayoutGrid,
  CtaBanner,
  CtaCardRow,
  FrontImage,
  HeaderGridItem,
  HeroImageWrapper,
  ImageContainer,
  StepCard,
  StepCardFade,
  StepCardImg,
  StepCardNumber,
  StepCardsWrapper,
  StyledBannerText,
  StyledButton,
  StyledLimitedContainerWidth,
  StyledLimitedWidthContainer,
  ThreeStepsBackgroundContainer,
} from './YppLandingView.styles'

export const YppLandingView: FC = () => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const { ref: frontImageRef } = useParallax<HTMLImageElement>({
    startScroll: 0,
    endScroll: smMatch ? window.innerHeight / 3 : window.innerHeight,
    translateY: [0, -15],
  })
  const { ref: dashboardImageRef } = useParallax<HTMLImageElement>({
    endScroll: smMatch ? window.innerHeight / 3 : window.innerHeight,
    translateY: [0, -15],
  })
  const { ref: myVideosImageRef } = useParallax<HTMLImageElement>({
    endScroll: smMatch ? window.innerHeight / 3 : window.innerHeight,
    translateY: [0, 15],
  })
  const { ref: youtubeSyncImageRef } = useParallax<HTMLImageElement>({
    endScroll: smMatch ? window.innerHeight / 3 : window.innerHeight,
    translateY: [15, -15],
  })
  const { ref: nftCardImageRef } = useParallax<HTMLImageElement>({
    endScroll: smMatch ? window.innerHeight / 3 : window.innerHeight,
    translateY: [0, 10],
  })
  const { ref: nftContextMenuImageRef } = useParallax<HTMLImageElement>({
    endScroll: smMatch ? window.innerHeight / 3 : window.innerHeight,
    translateY: [0, -40],
  })
  const { ref: nftCursorImageRef } = useParallax<HTMLImageElement>({
    endScroll: smMatch ? window.innerHeight / 3 : window.innerHeight,
    translateY: [0, -30],
  })
  const { ref: cartTokenImageRef } = useParallax<HTMLImageElement>({
    endScroll: smMatch ? window.innerHeight / 3 : window.innerHeight,
    translateY: [0, 50],
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
      <ThreeStepsBackgroundContainer>
        <StyledLimitedContainerWidth as="section">
          {/* TODO add reward section above */}
          <CenteredLayoutGrid>
            <HeaderGridItem
              marginBottom={8}
              as="header"
              colStart={{ sm: 3, lg: 4 }}
              colSpan={{ base: 12, sm: 8, lg: 6 }}
            >
              <Text variant={mdMatch ? 'h800' : 'h600'} as="h2">
                Get started in 3 steps
              </Text>
              <Text variant="t300" as="p" margin={{ top: 4, bottom: 8 }} color="colorText">
                Our fully automated verification process is as simple as 1-2-3. If you don't have an Atlas channel
                already, you'll be able to create one for free.{' '}
              </Text>
              <Button size="large" iconPlacement="right" icon={<SvgActionChevronR />}>
                Sign up now
              </Button>
              <Text variant="t100" as="p" color="colorTextMuted" margin={{ top: 2 }}>
                It takes 3 minutes and is 100% free.
              </Text>
            </HeaderGridItem>
            <StepCardsWrapper colStart={{ lg: 2 }} colSpan={{ base: 12, lg: 10 }}>
              <StepCard>
                <StepCardNumber>1</StepCardNumber>
                <Text variant={mdMatch ? 'h500' : 'h400'} as="h2">
                  Create membership & channel
                </Text>
                <StepCardImg src={createMember} alt="Create member dialog step" />
                <StepCardFade />
              </StepCard>
              <StepCard>
                <StepCardNumber>2</StepCardNumber>
                <Text variant={mdMatch ? 'h500' : 'h400'} as="h2">
                  Authorize your YouTube channel
                </Text>
                <StepCardImg src={selectChannel} alt="Select channel dialog step" />
                <StepCardFade />
              </StepCard>
              <StepCard>
                <StepCardNumber>3</StepCardNumber>
                <Text variant={mdMatch ? 'h500' : 'h400'} as="h2">
                  Collect JOY and earn even more
                </Text>
                <StepCardImg src={memberDropdown} alt="Member dropdown" />
                <StepCardFade />
              </StepCard>
            </StepCardsWrapper>
          </CenteredLayoutGrid>
        </StyledLimitedContainerWidth>
      </ThreeStepsBackgroundContainer>
      {/* ypp benefits */}
      <BackgroundContainer noBackground>
        <StyledLimitedContainerWidth as="section">
          <CardsWithImagesContainer>
            <CenteredLayoutGrid>
              <HeaderGridItem
                marginBottom={mdMatch ? 24 : 16}
                as="header"
                colStart={{ sm: 3, lg: 4 }}
                colSpan={{ base: 12, sm: 8, lg: 6 }}
              >
                <Text variant={mdMatch ? 'h800' : 'h600'} as="h2">
                  There is a lot more to YouTube Partner Program
                </Text>
                <Text variant="t300" as="p" margin={{ top: 4 }} color="colorText">
                  New to Atlas? Joining our YouTube Partner Program is an exciting opportunity to try out the future of
                  online video sharing. And we're only getting started.
                </Text>
              </HeaderGridItem>
            </CenteredLayoutGrid>

            <CardImageRow>
              <GridItem colStart={{ sm: 2, md: 1, lg: 2 }} colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}>
                <ImageContainer>
                  <CardImage dropShadow absolute src={dashboardImgBack} alt="Dashboard" />
                  <CardImage dropShadow src={dashboardImgFront} ref={dashboardImageRef} alt="Reward card" />
                </ImageContainer>
              </GridItem>
              <GridItem colStart={{ sm: 3, md: 8 }} colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}>
                <ContentCard
                  title="Manage your channel on a simple dashboard"
                  subtitle="YPP dashboard"
                  body="There you can check your channel status and get instructions on completing all actions to get rewards"
                />
              </GridItem>
            </CardImageRow>

            <CardImageRow>
              <GridItem colStart={{ sm: 2, md: 6, lg: 6 }} colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}>
                <ImageContainer positionOnMobile="flex-end">
                  <CardImage absolute dropShadow src={myVideosBack} alt="My videos" />
                  <CardImage dropShadow src={myVideosFront} ref={myVideosImageRef} alt="Button" />
                </ImageContainer>
              </GridItem>
              <GridItem
                colStart={{ sm: 3, md: 1, lg: 2 }}
                rowStart={{ md: 1 }}
                colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}
              >
                <ContentCard
                  title="Backup your videos and own them forever"
                  subtitle="YouTube backup"
                  body="You can sleep peacefully knowing that your conent is safe and forever stored on blockchain. You can even sell it as NFTs — you own it forever."
                />
              </GridItem>
            </CardImageRow>

            <CardImageRow>
              <GridItem colStart={{ sm: 2, md: 1, lg: 2 }} colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}>
                <ImageContainer positionOnMobile="center">
                  <CardImage absolute src={youtubeSyncBack} alt="Video tiles" />
                  <CardImage src={youtubeSyncFront} ref={youtubeSyncImageRef} alt="Video tile" />
                </ImageContainer>
              </GridItem>
              <GridItem colStart={{ sm: 3, md: 8 }} colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}>
                <ContentCard
                  pill={{
                    label: 'Coming later this year',
                  }}
                  title="Automatic YouTube video sync"
                  subtitle="YouTube sync"
                  body="Set up once and do nothing. Your videos will be automaticly synced from youtube to Atlas and you will still earn for it passively."
                />
              </GridItem>
            </CardImageRow>
          </CardsWithImagesContainer>
        </StyledLimitedContainerWidth>
      </BackgroundContainer>

      {/* nfts */}
      <BackgroundContainer>
        <StyledLimitedContainerWidth>
          <CardsWithImagesContainer>
            <CardImageRow>
              <GridItem colStart={{ sm: 2, md: 1, lg: 2 }} colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}>
                <ImageContainer positionOnMobile="center">
                  <CardImage absolute src={videoNfts1} alt="Nft tiles" />
                  <CardImage dropShadow absolute src={videoNfts2} ref={nftCardImageRef} alt="Single nft tile" />
                  <CardImage
                    dropShadow
                    absolute
                    src={videoNfts3}
                    ref={nftContextMenuImageRef}
                    alt="Context menu of nft tile"
                  />
                  <CardImage src={videoNfts4} ref={nftCursorImageRef} alt="Cursor" />
                </ImageContainer>
              </GridItem>
              <GridItem colStart={{ sm: 3, md: 8 }} colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}>
                <ContentCard
                  title="Monetise your videos with NFT sales and royalties"
                  subtitle="Video NFTs"
                  body="Turn your videos into NFTs and put them up for sale.  Choose between fixed price, open auction, and timed auction. Define royalties to get a cut every time your NFT gets sold again.There you can check your channel status and get instructions on completing all actions to get rewards"
                />
              </GridItem>
            </CardImageRow>

            <CardImageRow>
              <GridItem colStart={{ sm: 2, md: 6, lg: 6 }} colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}>
                <ImageContainer>
                  <CardImage dropShadow absolute src={crt1} alt="Creator token dashboard" />
                  <CardImage dropShadow absolute src={crt2} ref={cartTokenImageRef} alt="Creator token holders" />
                  <CardImage src={crt3} />
                </ImageContainer>
              </GridItem>
              <GridItem
                colStart={{ sm: 3, md: 1, lg: 2 }}
                rowStart={{ md: 1 }}
                colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}
              >
                <ContentCard
                  title="New ways to engage and get support from your audience"
                  subtitle="CREATOR TOKENS"
                  body="Turn viewers into evengelists [?] by letting them hold a share in your channel when they buy your own channel token."
                />
              </GridItem>
            </CardImageRow>
          </CardsWithImagesContainer>
        </StyledLimitedContainerWidth>
      </BackgroundContainer>
      <BackgroundContainer as="footer" noBackground>
        <StyledLimitedContainerWidth>
          <LayoutGrid>
            <GridItem colStart={{ lg: 2 }} colSpan={{ base: 12, lg: 10 }}>
              <CtaBanner>
                <Text variant="h100" as="p" color="colorText">
                  Get started now
                </Text>
                <StyledBannerText
                  variant={mdMatch ? 'h700' : 'h600'}
                  as="h2"
                  color="colorCoreBaseWhite"
                  margin={{ top: 1 }}
                >
                  Get the most out of your YouTube channel
                </StyledBannerText>

                <StyledButton size="large" icon={<SvgActionChevronR />} iconPlacement="right">
                  Authorize with YouTube
                </StyledButton>
              </CtaBanner>
            </GridItem>
          </LayoutGrid>
        </StyledLimitedContainerWidth>
      </BackgroundContainer>
      <CtaCardRow>
        <CallToActionButton external colorVariant="lightBlue" icon={<SvgActionInfo />} label="Program details" />
        <CallToActionButton external colorVariant="lightBlue" icon={<SvgActionSpeech />} label="Discord" />
        <CallToActionButton external colorVariant="lightBlue" icon={<SvgActionTokensStack />} label="Payments" />
      </CtaCardRow>
    </>
  )
}
