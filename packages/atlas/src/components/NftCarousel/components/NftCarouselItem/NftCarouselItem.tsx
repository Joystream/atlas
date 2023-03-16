import { ReactNode } from 'react'

import { SvgActionChevronL, SvgActionChevronR } from '@/assets/icons'

import { ItemWrapper, LeftChevronContainer, RightChevronContainer } from './NftCarouselItem.styles'

type CarouselItemProps = {
  position: 'side' | 'active'

  onClick?: (dir: '<' | '>') => void
  children?: ReactNode
}
export const NftCarouselItem = ({ position, onClick, children }: CarouselItemProps) => {
  return (
    <ItemWrapper className="glide__slide" data-glide-el="controls">
      {position === 'side' && (
        <>
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
        </>
      )}
      {children}
    </ItemWrapper>
  )
}
