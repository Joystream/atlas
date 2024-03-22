import styled from '@emotion/styled'
import { useCallback, useMemo, useState } from 'react'

import { GetBasicCreatorTokensQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { GetFeaturedNftsVideosQuery } from '@/api/queries/__generated__/nfts.generated'
import { Carousel, CarouselProps, SwiperInstance } from '@/components/Carousel'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { breakpoints, media } from '@/styles'

import { MarketplaceCarouselCard } from './components/MarketplaceCarouselCard'
import { MarketplaceCarouselItem } from './components/MarketplaceCarouselItem/MarketplaceCarouselItem'

type NftCarouselType = {
  type: 'nft'
  nfts: GetFeaturedNftsVideosQuery['ownedNfts']
}

type CrtCarouselType = {
  type: 'crt'
  crts: GetBasicCreatorTokensQuery['creatorTokens']
}

type MarketplaceCarouselTypes = NftCarouselType | CrtCarouselType

export type MarketplaceCarouselProps = MarketplaceCarouselTypes & {
  carouselProps?: Omit<CarouselProps, 'children'>
  isLoading?: boolean
}

const responsive: CarouselProps['breakpoints'] = {
  [parseInt(breakpoints.md)]: {
    slidesPerView: 1.4,
  },
  [parseInt(breakpoints.xl)]: {
    slidesPerView: 1.6,
  },
}

export const MarketplaceCarousel = ({ carouselProps, isLoading, ...rest }: MarketplaceCarouselProps) => {
  const [glider, setGlider] = useState<SwiperInstance | null>(null)
  const { trackNFTCarouselNext, trackNFTCarouselPrev } = useSegmentAnalytics()
  const mdMatch = useMediaMatch('md')

  const handleNextSlide = useCallback(
    <T extends { id?: string }>(slideIndex: string, item?: T) => {
      trackNFTCarouselNext(slideIndex, item?.id)
      glider?.slideNext()
    },
    [glider, trackNFTCarouselNext]
  )

  const handlePrevSlide = useCallback(
    <T extends { id?: string }>(slideIndex: string, item?: T) => {
      trackNFTCarouselPrev(slideIndex, item?.id)
      glider?.slidePrev()
    },
    [glider, trackNFTCarouselPrev]
  )

  const content = useMemo(() => {
    if (isLoading) {
      return [
        <StyledSkeleton key={1} />,
        <StyledSkeleton key={2} />,
        <StyledSkeleton key={3} />,
        <StyledSkeleton key={4} />,
      ]
    }

    if (rest.type === 'nft' && rest.nfts && glider) {
      return rest.nfts.map((nft, idx) => (
        <MarketplaceCarouselItem
          key={idx}
          onClick={(dir) => (dir === '>' ? handleNextSlide(idx.toString(), nft) : handlePrevSlide(idx.toString(), nft))}
        >
          {(isActive) => (
            <MarketplaceCarouselCard
              slideNext={() => handleNextSlide(idx.toString(), nft)}
              active={isActive}
              type="nft"
              nft={nft}
            />
          )}
        </MarketplaceCarouselItem>
      ))
    }

    if (rest.type === 'crt' && rest.crts && glider) {
      return rest.crts.map((crt, idx) => (
        <MarketplaceCarouselItem
          key={idx}
          onClick={(dir) => (dir === '>' ? handleNextSlide(idx.toString(), crt) : handlePrevSlide(idx.toString(), crt))}
        >
          {(isActive) => (
            <MarketplaceCarouselCard
              slideNext={() => handleNextSlide(idx.toString(), crt)}
              active={isActive}
              type="crt"
              crt={crt}
            />
          )}
        </MarketplaceCarouselItem>
      ))
    }

    return [null]
  }, [isLoading, rest, glider, handleNextSlide, handlePrevSlide])

  if (!isLoading && ((rest.type === 'nft' && rest.nfts.length < 4) || (rest.type === 'crt' && rest.crts.length < 4))) {
    return null
  }

  return (
    <FullWidthWrapper>
      <Carousel
        spaceBetween={mdMatch ? 24 : 16}
        loop
        roundLengths
        centeredSlides
        slidesPerView={1.3}
        breakpoints={responsive}
        onSwiper={(swiper) => setGlider(swiper)}
      >
        {content}
      </Carousel>
    </FullWidthWrapper>
  )
}

const StyledSkeleton = styled(SkeletonLoader)`
  width: 100%;
  aspect-ratio: 1/1;

  ${media.sm} {
    aspect-ratio: 16/9;
  }
`

export const FullWidthWrapper = styled.div`
  width: calc(100% + var(--size-global-horizontal-padding) * 2);
  margin-left: calc(var(--size-global-horizontal-padding) * -1);
  overflow: hidden;
  position: relative;
`
