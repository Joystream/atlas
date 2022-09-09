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
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CallToActionButton } from '@/components/_buttons/CallToActionButton'
import { SvgActionChevronR, SvgActionInfo, SvgActionSpeech, SvgActionTokensStack } from '@/components/_icons'
import { ContentCard } from '@/components/_ypp/ContentCard'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  BackImage,
  BackgroundContainer,
  CardImage,
  CardImageRow,
  CardsLimitedWidtContainer,
  CardsWithImagesContainer,
  CenteredLayoutGrid,
  CtaBanner,
  CtaCardRow,
  CtaLimitedWidthContainer,
  FrontImage,
  HeaderGridItem,
  HeroImageWrapper,
  HeroLimitedWidthContainer,
  ImageContainer,
  StepCard,
  StepCardFade,
  StepCardImg,
  StepCardNumber,
  StepCardsWrapper,
  StyledBannerText,
  StyledButton,
  ThreeStepsBackgroundContainer,
} from './YppLandingView.styles'

export const YppLandingView: FC = () => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const endScroll = smMatch ? window.innerHeight / 3 : window.innerHeight
  const { ref: heroImageRef } = useParallax<HTMLImageElement>({
    startScroll: 0,
    endScroll,
    translateY: [0, -15],
  })
  const { ref: dashboardImageRef } = useParallax<HTMLImageElement>({
    endScroll,
    translateY: [0, -20],
  })
  const { ref: myVideosFloatingButtonRef } = useParallax<HTMLImageElement>({
    endScroll,
    translateY: [-5, 5],
    translateX: [0, -10],
  })
  const { ref: uploadVideoImageRef } = useParallax<HTMLImageElement>({
    endScroll,
    translateY: [10, -10],
  })
  const { ref: nftCardImageRef } = useParallax<HTMLImageElement>({
    endScroll,
    translateY: [20, -20],
  })
  const { ref: nftContextMenuImageRef } = useParallax<HTMLImageElement>({
    endScroll,
    translateY: [20, -15],
  })
  const { ref: nftCursorImageRef } = useParallax<HTMLImageElement>({
    endScroll,
    translateY: [-40, -5],
  })
  const { ref: cartTokenImageRef } = useParallax<HTMLImageElement>({
    endScroll,
    translateY: [0, 35],
  })

  return (
    <>
      <HeroLimitedWidthContainer>
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
            ref={heroImageRef}
            srcSet={`${hero576} 576w, ${hero864} 864w, ${hero1152} 1152w, ${hero2304} 2304w`}
            alt="Hero front"
          />
        </HeroImageWrapper>
      </HeroLimitedWidthContainer>
      <ThreeStepsBackgroundContainer>
        <CardsLimitedWidtContainer as="section">
          {/* TODO add reward section above */}
          <CenteredLayoutGrid>
            <HeaderGridItem
              marginBottom={8}
              as="header"
              colStart={{ sm: 3, lg: 4 }}
              colSpan={{ base: 12, sm: 8, lg: 6 }}
            >
              <Text variant={mdMatch ? 'h700' : 'h600'} as="h2">
                Get started in 3 steps
              </Text>
              <Text variant="t300" as="p" margin={{ top: 4, bottom: 8 }} color="colorText">
                Our fully automated verification process is as simple as 1-2-3. If you don't have an Atlas channel
                already, you'll be able to create one for free.
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
                  Collect JOY tokens and access all Atlas features
                </Text>
                <StepCardImg src={memberDropdown} alt="Member dropdown" />
                <StepCardFade />
              </StepCard>
            </StepCardsWrapper>
          </CenteredLayoutGrid>
        </CardsLimitedWidtContainer>
      </ThreeStepsBackgroundContainer>
      {/* ypp benefits */}
      <BackgroundContainer noBackground>
        <CardsLimitedWidtContainer as="section">
          <CardsWithImagesContainer>
            <CenteredLayoutGrid>
              <HeaderGridItem
                marginBottom={mdMatch ? 24 : 16}
                as="header"
                colStart={{ sm: 3, lg: 4 }}
                colSpan={{ base: 12, sm: 8, lg: 6 }}
              >
                <Text variant={mdMatch ? 'h700' : 'h600'} as="h2">
                  There is more to YouTube Partner Program
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
                  subtitle="Dashboard"
                  body="YouTube Partner Program dashboard in Atlas Studio allows you to see the list of rewardable tasks alongside other information about the program. "
                />
              </GridItem>
            </CardImageRow>

            <CardImageRow>
              <GridItem colStart={{ sm: 2, md: 6, lg: 6 }} colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}>
                <ImageContainer positionOnMobile="flex-end">
                  <CardImage absolute dropShadow src={myVideosBack} alt="My videos" />
                  <CardImage dropShadow src={myVideosFront} ref={myVideosFloatingButtonRef} alt="Button" />
                </ImageContainer>
              </GridItem>
              <GridItem
                colStart={{ sm: 3, md: 1, lg: 2 }}
                rowStart={{ md: 1 }}
                colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}
              >
                <ContentCard
                  title="Upload your videos and own them like you mean it"
                  subtitle="Joystream"
                  body="All the information about your videos is securely stored on the Joystream blockchain, which is owned and operated by the community."
                />
              </GridItem>
            </CardImageRow>

            <CardImageRow>
              <GridItem colStart={{ sm: 2, md: 1, lg: 2 }} colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}>
                <ImageContainer positionOnMobile="center">
                  <CardImage absolute src={youtubeSyncBack} alt="Video tiles" />
                  <CardImage src={youtubeSyncFront} ref={uploadVideoImageRef} alt="Video tile" />
                </ImageContainer>
              </GridItem>
              <GridItem colStart={{ sm: 3, md: 8 }} colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}>
                <ContentCard
                  pill={{
                    label: 'Coming later this year',
                  }}
                  title="Automatic YouTube video sync"
                  subtitle="YouTube sync"
                  body="All the videos you upload to your YouTube channel will appear in Atlas automatically, allowing you to reach a greater audience."
                />
              </GridItem>
            </CardImageRow>
          </CardsWithImagesContainer>
        </CardsLimitedWidtContainer>
      </BackgroundContainer>

      {/* nfts */}
      <BackgroundContainer>
        <CardsLimitedWidtContainer>
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
                  title="Monetize your videos with NFT sales and royalties"
                  subtitle="Video NFTs"
                  body="Turn your videos into NFTs and put them up for sale. Choose between fixed price, open auction, and timed auction. Define royalties to get a cut every time your NFT gets sold again."
                />
              </GridItem>
            </CardImageRow>

            <CardImageRow>
              <GridItem colStart={{ sm: 2, md: 6, lg: 6 }} colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}>
                <ImageContainer hiddenOverflow>
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
                  pill={{ label: 'Coming early 2023' }}
                  title="New ways to engage and get support from your audience"
                  subtitle="Creator tokens"
                  body="Turn viewers into evangelists by letting them hold a share in your channel when they buy your own channel token."
                />
              </GridItem>
            </CardImageRow>
          </CardsWithImagesContainer>
        </CardsLimitedWidtContainer>
      </BackgroundContainer>
      <CtaLimitedWidthContainer>
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
      </CtaLimitedWidthContainer>
      <CtaCardRow>
        <CallToActionButton external colorVariant="lightBlue" icon={<SvgActionInfo />} label="Program details" />
        <CallToActionButton external colorVariant="lightBlue" icon={<SvgActionSpeech />} label="Discord" />
        <CallToActionButton external colorVariant="lightBlue" icon={<SvgActionTokensStack />} label="Payments" />
      </CtaCardRow>
    </>
  )
}
