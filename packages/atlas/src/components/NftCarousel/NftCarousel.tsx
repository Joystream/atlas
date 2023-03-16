import Glider from '@glidejs/glide'
import { useCallback, useState } from 'react'

import { GetFeaturedNftsQuery } from '@/api/queries/__generated__/nfts.generated'
import { Carousel, CarouselProps } from '@/components/Carousel'
import { MarketplaceCarouselCard } from '@/components/NftCarousel/components/MarketplaceCarouselCard'
import { NftCarouselItem } from '@/components/NftCarousel/components/NftCarouselItem/NftCarouselItem'

type NftCarouselType = {
  type: 'nft'
  nfts: GetFeaturedNftsQuery['ownedNfts']
}

type MarketplaceCarouselTypes = NftCarouselType

type MarketplaceCarousel = MarketplaceCarouselTypes & {
  carouselProps?: Omit<CarouselProps, 'children'>
}

export const NftCarousel = ({ carouselProps, ...rest }: MarketplaceCarousel) => {
  const [currentMiddleItem, setCurrentMiddleItem] = useState(1)

  const contentMapper = useCallback(
    (glider: Glider | undefined, props: MarketplaceCarouselTypes) => {
      if (props.type === 'nft') {
        return (
          props.nfts?.map((nft, idx) => (
            <NftCarouselItem
              key={idx}
              position={currentMiddleItem === idx ? 'active' : 'side'}
              onClick={(dir) => glider?.go(dir)}
            >
              <MarketplaceCarouselCard active={currentMiddleItem === idx} type="nft" nft={nft} />
            </NftCarouselItem>
          )) ?? [null]
        )
      }

      return [null]
    },
    [currentMiddleItem]
  )

  return (
    <Carousel
      type="carousel"
      perView={2}
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
