import { useParallax, useParallaxController } from 'react-scroll-parallax'

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
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { ContentCard } from '@/components/_ypp/ContentCard'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { CardImage, CardImageRow, CardsWithImagesContainer, ImageContainer } from './YppCardsSection.styles'
import {
  BackgroundContainer,
  CardsLimitedWidtContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
} from './YppLandingView.styles'

export const YppCardsSections = () => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const endScroll = smMatch ? window.innerHeight / 3 : window.innerHeight
  // const { ref: dashboardImageRef } = useParallax<HTMLImageElement>({
  //   endScroll,
  //   translateY: [0, -20],
  // })
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
      <BackgroundContainer noBackground>
        <CardsLimitedWidtContainer as="section">
          <CardsWithImagesContainer>
            <CenteredLayoutGrid>
              <HeaderGridItem as="header" colStart={{ sm: 3, lg: 4 }} colSpan={{ base: 12, sm: 8, lg: 6 }}>
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
                  <ImageWithParallaxEffect />
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
    </>
  )
}

const ImageWithParallaxEffect = () => {
  const parallaxController = useParallaxController()
  const smMatch = useMediaMatch('sm')

  const endScroll = smMatch ? window.innerHeight / 3 : window.innerHeight
  const { ref: dashboardImageRef } = useParallax<HTMLImageElement>({
    endScroll,
    translateY: [0, -20],
  })

  // updates cached values after image dimensions have loaded
  const handleLoad = () => parallaxController?.update()
  return <CardImage dropShadow src={dashboardImgFront} ref={dashboardImageRef} alt="Reward card" onLoad={handleLoad} />
}
