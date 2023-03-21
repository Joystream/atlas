import { ReactNode } from 'react'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'

import { ItemWrapper, LeftChevronContainer, NavigationContainer, RightChevronContainer } from './NftCarouselItem.styles'

type CarouselNavItemProps = {
  position: 'side' | 'active'

  onClick?: (dir: '<' | '>') => void
  children?: ReactNode
}
export const CarouselNavItem = ({ position, onClick, children }: CarouselNavItemProps) => {
  return (
    <ItemWrapper className="glide__slide">
      {position === 'side' && (
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
      {children}
    </ItemWrapper>
  )
}
