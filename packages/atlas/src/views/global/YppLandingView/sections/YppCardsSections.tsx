import { FC } from 'react'
import { useParallax } from 'react-scroll-parallax'
import { ParallaxProps } from 'react-scroll-parallax/dist/components/Parallax/types'

import crt1 from '@/assets/images/illustration-crt-l1.webp'
import crt2 from '@/assets/images/illustration-crt-l2.webp'
import gated1 from '@/assets/images/illustration-gated-l1.webp'
import gated2 from '@/assets/images/illustration-gated-l2.webp'
import tip1 from '@/assets/images/illustration-tip-l1.webp'
import tip2 from '@/assets/images/illustration-tip-l2.webp'
import tip3 from '@/assets/images/illustration-tip-l3.webp'
import videoNfts1 from '@/assets/images/illustration-video-nfts-l1.webp'
import videoNfts2 from '@/assets/images/illustration-video-nfts-l2.webp'
import videoNfts3 from '@/assets/images/illustration-video-nfts-l3.webp'
import videoNfts4 from '@/assets/images/illustration-video-nfts-l4.webp'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { ContentCard } from '@/components/_ypp/ContentCard'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

import { CardImage, CardImageRow, CardsWithImagesContainer, ImageContainer } from './YppCardsSection.styles'

import {
  BackgroundContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
  StyledLimitedWidthContainer,
} from '../YppLandingView.styles'

export const YppCardsSections: FC = () => {
  const smMatch = useMediaMatch('sm')
  const endScroll = smMatch ? window.innerHeight / 3 : window.innerHeight
  const [titleVariant, subtitleVariant] = useSectionTextVariants()

  const commonParallaxOpts: ParallaxProps = {
    disabled: !smMatch,
    endScroll,
    speed: 0.2,
  }

  const appName = atlasConfig.general.appName

  return (
    <>
      <BackgroundContainer noBackground>
        <StyledLimitedWidthContainer as="section">
          <CardsWithImagesContainer>
            <CenteredLayoutGrid gap={4}>
              <HeaderGridItem
                as="header"
                colSpan={{ base: 12, sm: 10, md: 12, lg: 8 }}
                colStart={{ sm: 2, md: 1, lg: 3 }}
                data-aos="fade-up"
                data-aos-delay="350"
                data-aos-offset="80"
                data-aos-easing="atlas-easing"
              >
                <Text variant={titleVariant} as="h2">
                  Monetize your ${appName} channel
                </Text>
              </HeaderGridItem>
              <GridItem colSpan={{ base: 12, sm: 10, md: 8, lg: 6 }} colStart={{ sm: 2, md: 3, lg: 4 }}>
                <Text
                  variant={subtitleVariant}
                  as="p"
                  color="colorText"
                  data-aos="fade-up"
                  data-aos-delay="250"
                  data-aos-offset="40"
                  data-aos-easing="atlas-easing"
                >
                  Build a foundation for your {appName} channel with syncing YouTube content and tap into the future of
                  content monetization.
                </Text>
              </GridItem>
            </CenteredLayoutGrid>

            <CardImageRow as="article">
              <GridItem
                colStart={{ sm: 2, md: 1, lg: 2 }}
                colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}
                data-aos="fade-up"
                data-aos-delay="250"
                data-aos-offset="80"
                data-aos-easing="atlas-easing"
              >
                <ImageContainer positionOnMobile="center">
                  <CardImage absolute src={videoNfts1} alt="Nft tiles" width="640" height="413" />
                  <CardImageWithParallaxEffect
                    dropShadow
                    absolute
                    src={videoNfts2}
                    parallaxProps={{
                      ...commonParallaxOpts,
                      speed: 5,
                    }}
                    alt="Single nft tile"
                    width="640"
                    height="413"
                  />
                  <CardImageWithParallaxEffect
                    dropShadow
                    absolute
                    src={videoNfts3}
                    parallaxProps={{
                      ...commonParallaxOpts,
                      speed: 10,
                      translateX: [13, 13],
                    }}
                    alt="Context menu of nft tile"
                    width="640"
                    height="413"
                  />
                  <CardImageWithParallaxEffect
                    src={videoNfts4}
                    parallaxProps={{
                      ...commonParallaxOpts,
                      speed: 15,
                    }}
                    alt="Cursor"
                    width="640"
                    height="413"
                  />
                </ImageContainer>
              </GridItem>
              <GridItem
                colStart={{ sm: 3, md: 8 }}
                colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}
                data-aos="fade-up"
                data-aos-delay="350"
                data-aos-offset="80"
                data-aos-easing="atlas-easing"
              >
                <ContentCard
                  title="Mint and sell video NFTs on the Marketplace"
                  subtitle="Video NFTs"
                  body="Turn your videos into NFTs and put them up for sale. Choose between fixed price, open auction, and timed auction. Define royalties to get a cut every time your NFT gets sold again."
                />
              </GridItem>
            </CardImageRow>

            <CardImageRow as="article">
              <GridItem
                colStart={{ sm: 2, md: 6, lg: 6 }}
                colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}
                data-aos="fade-up"
                data-aos-delay="350"
                data-aos-offset="100"
                data-aos-easing="atlas-easing"
              >
                <ImageContainer hiddenOverflow>
                  <CardImage dropShadow absolute src={crt1} alt="Creator token dashboard" width="640" height="460" />
                  <CardImageWithParallaxEffect
                    dropShadow
                    src={crt2}
                    parallaxProps={{
                      ...commonParallaxOpts,
                      speed: 5,
                    }}
                    alt="Creator token holders"
                    width="640"
                    height="460"
                  />
                </ImageContainer>
              </GridItem>
              {/*<GridItem*/}
              {/*  colStart={{ sm: 2, md: 6, lg: 6 }}*/}
              {/*  colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}*/}
              {/*  data-aos="fade-up"*/}
              {/*  data-aos-delay="250"*/}
              {/*  data-aos-offset="80"*/}
              {/*  data-aos-easing="atlas-easing"*/}
              {/*>*/}
              {/*  <ImageContainer positionOnMobile="flex-end">*/}
              {/*    <CardImage absolute dropShadow src={myVideosBack} alt="My videos" width="640" height="360" />*/}
              {/*    <CardImageWithParallaxEffect*/}
              {/*      dropShadow*/}
              {/*      src={myVideosFront}*/}
              {/*      parallaxProps={{*/}
              {/*        ...commonParallaxOpts,*/}
              {/*        speed: 5,*/}
              {/*      }}*/}
              {/*      alt="Button"*/}
              {/*      width="640"*/}
              {/*      height="360"*/}
              {/*    />*/}
              {/*  </ImageContainer>*/}
              {/*</GridItem>*/}
              <GridItem
                colStart={{ sm: 3, md: 1, lg: 2 }}
                rowStart={{ md: 1 }}
                colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}
                data-aos="fade-up"
                data-aos-delay="350"
                data-aos-offset="80"
                data-aos-easing="atlas-easing"
              >
                <ContentCard
                  pill={{ label: 'Coming late 2023' }}
                  title="Issue Channel Tokens"
                  subtitle="Creator tokens"
                  body="Turn viewers into evangelists by letting them hold a share in your channel when they buy your own channel token."
                />
              </GridItem>
            </CardImageRow>

            <CardImageRow as="article">
              <GridItem
                colStart={{ sm: 2, md: 1, lg: 2 }}
                colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}
                data-aos="fade-up"
                data-aos-delay="250"
                data-aos-offset="80"
                data-aos-easing="atlas-easing"
              >
                <ImageContainer positionOnMobile="center">
                  <CardImage absolute src={tip1} alt="Tip tile" width="640" height="386" />
                  <CardImageWithParallaxEffect
                    src={tip2}
                    parallaxProps={{
                      ...commonParallaxOpts,
                      speed: 5,
                    }}
                    alt="Tip button"
                    width="640"
                    height="412"
                  />
                  <CardImage absolute src={tip3} alt="Tip cursor" width="640" height="386" />
                </ImageContainer>
              </GridItem>
              <GridItem
                colStart={{ sm: 3, md: 8 }}
                colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}
                data-aos="fade-up"
                data-aos-delay="350"
                data-aos-offset="80"
                data-aos-easing="atlas-easing"
              >
                <ContentCard
                  pill={{ label: 'Coming early 2024' }}
                  title="Get recognized and supported with tips"
                  subtitle="Tips"
                  body="Receive tips from your viewers who appreciate your work and want you to know about it."
                />
              </GridItem>
            </CardImageRow>

            <CardImageRow as="article">
              <GridItem
                colStart={{ sm: 2, md: 6, lg: 6 }}
                colSpan={{ base: 12, sm: 10, md: 7, lg: 6 }}
                data-aos="fade-up"
                data-aos-delay="350"
                data-aos-offset="100"
                data-aos-easing="atlas-easing"
              >
                <ImageContainer hiddenOverflow>
                  <CardImage dropShadow absolute src={gated1} alt="Creator token dashboard" width="640" height="460" />
                  <CardImageWithParallaxEffect
                    dropShadow
                    src={gated2}
                    parallaxProps={{
                      ...commonParallaxOpts,
                      speed: 5,
                    }}
                    alt="Creator token holders"
                    width="640"
                    height="460"
                  />
                </ImageContainer>
              </GridItem>
              <GridItem
                colStart={{ sm: 3, md: 1, lg: 2 }}
                rowStart={{ md: 1 }}
                colSpan={{ base: 12, sm: 8, md: 5, lg: 4 }}
                data-aos="fade-up"
                data-aos-delay="350"
                data-aos-offset="80"
                data-aos-easing="atlas-easing"
              >
                <ContentCard
                  pill={{ label: 'Coming early 2024' }}
                  title="Create videos which only your supporters can access"
                  subtitle="Gated content"
                  body="Offer exclusive content to the selected members who purchased your tokens and NFTs."
                />
              </GridItem>
            </CardImageRow>
          </CardsWithImagesContainer>
        </StyledLimitedWidthContainer>
      </BackgroundContainer>
    </>
  )
}

type CardImageWithParallaxEffectProps = {
  src: string
  alt: string
  dropShadow?: boolean
  absolute?: boolean
  parallaxProps: ParallaxProps
  width?: string
  height?: string
}

const CardImageWithParallaxEffect: FC<CardImageWithParallaxEffectProps> = ({
  src,
  alt,
  dropShadow,
  parallaxProps,
  absolute,
  ...rest
}) => {
  const { ref: imageRef, controller } = useParallax<HTMLImageElement>(parallaxProps)

  // updates cached values after image dimensions have loaded
  const handleLoad = () => controller?.update()
  return (
    <CardImage
      absolute={absolute}
      dropShadow={dropShadow}
      src={src}
      ref={imageRef}
      alt={alt}
      onLoad={handleLoad}
      {...rest}
    />
  )
}
