import { To } from 'history'
import React, { FC, MouseEvent, ReactNode } from 'react'

import { SvgGlyphChevronRight } from '@/shared/icons'
import { getLinkPropsFromTo } from '@/utils/button'

import { BodyWrapper, ContentWrapper, IconWrapper, StyledContainer } from './CallToActionButton.style'

export type ColorVariants = 'red' | 'green' | 'yellow' | 'blue' | 'lightBlue'

export type CallToActionButtonProps = {
  to?: To
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  icon?: ReactNode
  colorVariant?: ColorVariants
  label: string
}

export const CallToActionButton: FC<CallToActionButtonProps> = ({
  to,
  icon,
  onClick,
  colorVariant = 'blue',
  label,
}) => {
  const linkProps = getLinkPropsFromTo(to)

  return (
    <StyledContainer {...linkProps} onClick={onClick} colorVariant={colorVariant}>
      <ContentWrapper>
        <IconWrapper colorVariant={colorVariant === 'blue' ? 'lightBlue' : colorVariant}>{icon}</IconWrapper>
        <BodyWrapper variant="h6">
          {label}
          <SvgGlyphChevronRight />
        </BodyWrapper>
      </ContentWrapper>
    </StyledContainer>
  )
}
