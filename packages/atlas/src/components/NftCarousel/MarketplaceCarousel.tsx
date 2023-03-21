import Glider from '@glidejs/glide'
import { useCallback, useState } from 'react'

import { GetFeaturedNftsQuery } from '@/api/queries/__generated__/nfts.generated'
import { Carousel, CarouselProps } from '@/components/Carousel'
import { MarketplaceCarouselCard } from '@/components/NftCarousel/components/MarketplaceCarouselCard'
import { CarouselNavItem } from '@/components/NftCarousel/components/NftCarouselItem/CarouselNavItem'
import { useMediaMatch } from '@/hooks/useMediaMatch'

type NftCarouselType = {
  type: 'nft'
  nfts?: GetFeaturedNftsQuery['ownedNfts']
}

type MarketplaceCarouselTypes = NftCarouselType

export type MarketplaceCarouselProps = MarketplaceCarouselTypes & {
  carouselProps?: Omit<CarouselProps, 'children'>
}

export const MarketplaceCarousel = ({ carouselProps, ...rest }: MarketplaceCarouselProps) => {
  const [currentMiddleItem, setCurrentMiddleItem] = useState(1)
  const smMatch = useMediaMatch('sm')
  const xlMatch = useMediaMatch('xl')

  const contentMapper = useCallback(
    (glider: Glider | undefined, props: MarketplaceCarouselTypes) => {
      if (props.type === 'nft' && props.nfts) {
        return props.nfts.map((nft, idx) => (
          <CarouselNavItem
            key={idx}
            position={currentMiddleItem === idx ? 'active' : 'side'}
            onClick={(dir) => glider?.go(dir)}
          >
            <MarketplaceCarouselCard active={currentMiddleItem === idx} type="nft" nft={nft} />
          </CarouselNavItem>
        ))
      }

      return [null]
    },
    [currentMiddleItem]
  )

  if (!rest.nfts) return null

  return (
    <Carousel
      type="carousel"
      perView={!smMatch ? 1.3 : !xlMatch ? 1.4 : 1.6}
      startAt={1}
      gap={12}
      focusAt="center"
      perSwipe=""
      onSwipeEnd={({ index }) => setCurrentMiddleItem(index)}
      {...carouselProps}
    >
      {({ glider }) => contentMapper(glider, rest)}
    </Carousel>
  )
}
