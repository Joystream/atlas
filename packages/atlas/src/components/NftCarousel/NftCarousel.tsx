import { ReactNode, useState } from 'react'

import { Carousel, CarouselProps } from '@/components/Carousel'
import { NftCarouselItem } from '@/components/NftCarousel/components/NftCarouselItem/NftCarouselItem'

type NftCarousel = Omit<CarouselProps, 'children'> & {
  nfts: ReactNode[]
}

export const NftCarousel = ({ nfts, ...gliderProps }: NftCarousel) => {
  const [currentMiddleItem, setCurrentMiddleItem] = useState(1)

  return (
    <Carousel
      type="carousel"
      perView={2}
      startAt={1}
      gap={12}
      focusAt="center"
      onSwipeEnd={({ index }) => setCurrentMiddleItem(index)}
      {...gliderProps}
    >
      {({ glider }) =>
        nfts.map((im, idx) => (
          <NftCarouselItem
            key={idx}
            position={currentMiddleItem === idx ? 'active' : 'side'}
            onClick={(dir) => glider?.go(dir)}
          >
            {im}
          </NftCarouselItem>
        ))
      }
    </Carousel>
  )
}
