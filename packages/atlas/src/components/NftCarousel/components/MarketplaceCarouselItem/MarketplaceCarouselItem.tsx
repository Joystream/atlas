import { ReactNode } from 'react'
import { useSwiperSlide } from 'swiper/react'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'

import {
  ItemWrapper,
  LeftChevronContainer,
  NavigationContainer,
  RightChevronContainer,
} from './MarketplaceCarouselItem.styles'

type MarketplaceCarouselItemProps = {
  onClick?: (dir: '<' | '>') => void
  children?: ((isActive: boolean) => ReactNode) | ReactNode
}
export const MarketplaceCarouselItem = ({ onClick, children }: MarketplaceCarouselItemProps) => {
  const { isActive } = useSwiperSlide()
  return (
    <ItemWrapper>
      {!isActive && (
        <NavigationContainer>
          <LeftChevronContainer onClick={() => onClick?.('<')}>
            <SvgActionChevronL />
          </LeftChevronContainer>
          <RightChevronContainer onClick={() => onClick?.('>')}>
            <SvgActionChevronR />
          </RightChevronContainer>
        </NavigationContainer>
      )}
      {typeof children === 'function' ? children(isActive) : children}
    </ItemWrapper>
  )
}
