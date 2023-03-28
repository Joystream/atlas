import { ReactNode } from 'react'
import { useSwiperSlide } from 'swiper/react'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'

import { ItemWrapper, LeftChevronContainer, NavigationContainer, RightChevronContainer } from './NftCarouselItem.styles'

type CarouselNavItemProps = {
  onClick?: (dir: '<' | '>') => void
  children?: ((isActive: boolean) => ReactNode) | ReactNode
}
export const CarouselNavItem = ({ onClick, children }: CarouselNavItemProps) => {
  const { isActive } = useSwiperSlide()
  return (
    <ItemWrapper className="glide__slide">
      {!isActive && (
        <NavigationContainer data-glide-el="controls">
          <LeftChevronContainer
            className="glide__arrow glide__arrow--left"
            data-glide-dir="<"
            onClick={() => onClick?.('<')}
          >
            <SvgActionChevronL />
          </LeftChevronContainer>
          <RightChevronContainer
            className="glide__arrow glide__arrow--right"
            data-glide-dir=">"
            onClick={() => onClick?.('>')}
          >
            <SvgActionChevronR />
          </RightChevronContainer>
        </NavigationContainer>
      )}
      {typeof children === 'function' ? children(isActive) : children}
    </ItemWrapper>
  )
}
