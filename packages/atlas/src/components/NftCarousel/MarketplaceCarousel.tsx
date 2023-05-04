import styled from '@emotion/styled'
import { useMemo, useState } from 'react'

import { GetFeaturedNftsVideosQuery } from '@/api/queries/__generated__/nfts.generated'
import { Carousel, CarouselProps, SwiperInstance } from '@/components/Carousel'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { breakpoints, media } from '@/styles'

import { MarketplaceCarouselCard } from './components/MarketplaceCarouselCard'
import { CarouselNavItem } from './components/NftCarouselItem/CarouselNavItem'

type NftCarouselType = {
  type: 'nft'
  nfts?: GetFeaturedNftsVideosQuery['ownedNfts']
}

type MarketplaceCarouselTypes = NftCarouselType

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
        <CarouselNavItem key={idx} onClick={(dir) => (dir === '>' ? glider?.slideNext() : glider?.slidePrev())}>
          {(isActive) => (
            <MarketplaceCarouselCard slideNext={() => glider?.slideNext()} active={isActive} type="nft" nft={nft} />
          )}
        </CarouselNavItem>
      ))
    }

    return [null]
  }, [rest.type, rest.nfts, glider, isLoading])

  if (!content.length) {
    return null
  }

  return (
    <Carousel
      spaceBetween={12}
      loop
      centeredSlides
      slidesPerView={1.3}
      breakpoints={responsive}
      onSwiper={(swiper) => setGlider(swiper)}
    >
      {content}
    </Carousel>
  )
}

const StyledSkeleton = styled(SkeletonLoader)`
  height: 325px;
  width: 100%;

  ${media.sm} {
    min-height: 340px;
  }

  ${media.md} {
    min-height: 410px;
  }

  ${media.lg} {
    min-height: 610px;
  }

  ${media.xl} {
    min-height: 660px;
  }

  ${media.xxl} {
    min-height: 830px;
  }
`
