import { ReactNode } from 'react'
import { useSwiperSlide } from 'swiper/react'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'

import { ItemWrapper, LeftChevronContainer, NavigationContainer, RightChevronContainer } from './NftCarouselItem.styles'

type NftCarouselItemProps = {
  onClick?: (dir: '<' | '>') => void
  children?: ((isActive: boolean) => ReactNode) | ReactNode
}
export const NftCarouselItem = ({ onClick, children }: NftCarouselItemProps) => {
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
