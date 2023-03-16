import styled from '@emotion/styled'

import { cVar } from '@/styles'

import { NftCarousel } from './NftCarousel'

export default {
  title: 'others/NftCarousel',
  component: NftCarousel,
}

export const Default = () => (
  <NftCarousel
    nfts={Array.from({ length: 10 }, (_, i) => (
      <CarouselItem key={i}> Carousel Item {i}</CarouselItem>
    ))}
  />
)

const CarouselItem = styled.div`
  min-height: 200px;
  text-align: center;
  color: ${cVar('colorCoreBaseWhite')};
  background-color: ${cVar('colorCoreNeutral300')};
  display: flex;
  align-items: center;
  justify-content: center;

  :not(:last-child) {
    margin-right: 12px;
  }
`
