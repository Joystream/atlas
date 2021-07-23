import React, { FC } from 'react'

import { SvgGlyphChevronRight } from '@/shared/icons'
import { getLinkPropsFromTo } from '@/utils/button'

import { BodyWrapper, ContentWrapper, IconWrapper, StyledContainer } from './CallToActionButton.style'
import { CallToActionButtonProps } from './CallToActionButton.types'

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
        <IconWrapper>{icon}</IconWrapper>
        <BodyWrapper>
          {label}
          <SvgGlyphChevronRight />
        </BodyWrapper>
      </ContentWrapper>
    </StyledContainer>
  )
}
