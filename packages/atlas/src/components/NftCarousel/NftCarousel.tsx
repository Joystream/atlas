import { useState } from 'react'

import { useGlider } from '@/components/Glider'
import { CarouselItem } from '@/components/NftCarousel/components/CarouselItem/CarouselItem'

const items = [
  <img key={1} src="https://picsum.photos/id/237/400/300" style={{ width: 400 }} alt="obre" draggable={false} />,
  <img key={2} src="https://picsum.photos/id/238/400/300" style={{ width: 400 }} alt="obre" draggable={false} />,
  <img key={3} src="https://picsum.photos/id/239/400/300" style={{ width: 400 }} alt="obre" draggable={false} />,
  <img key={4} src="https://picsum.photos/id/233/400/300" style={{ width: 400 }} alt="obre" />,
]
export const NftCarousel = () => {
  const [currentMiddleItem, setCurrentMiddleItem] = useState(1)
  const { ref, getGliderProps, getTrackProps, getContainerProps, glider } = useGlider<HTMLDivElement>({
    perView: 2,
    type: 'carousel',
    startAt: 1,
    gap: 12,
    focusAt: 'center',
    onSwipeEnd: ({ index }) => setCurrentMiddleItem(index),
  })

  return (
    <div ref={ref} {...getGliderProps()}>
      <div {...getTrackProps()} data-glide-el="track">
        <div {...getContainerProps()}>
          {items.map((im, idx) => (
            <CarouselItem
              key={idx}
              position={currentMiddleItem === idx ? 'active' : 'side'}
              onClick={(dir) => glider?.go(dir)}
            >
              {im}
            </CarouselItem>
          ))}
        </div>
      </div>
    </div>
  )
}
