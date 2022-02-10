import { To } from 'history'
import React, { FC, MouseEvent, ReactNode } from 'react'

import { SvgActionChevronR } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getLinkPropsFromTo } from '@/utils/button'

import { BodyWrapper, ContentWrapper, IconWrapper, StyledContainer } from './CallToActionButton.styles'

export type ColorVariants = 'red' | 'green' | 'yellow' | 'blue' | 'lightBlue' | 'white'

export type CallToActionButtonProps = {
  to?: To
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  icon?: ReactNode
  colorVariant?: ColorVariants
  iconColorVariant?: ColorVariants
  label: string
}

export const CallToActionButton: FC<CallToActionButtonProps> = ({
  to,
  icon,
  onClick,
  colorVariant = 'blue',
  iconColorVariant,
  label,
}) => {
  const xsMatch = useMediaMatch('xs')
  const linkProps = getLinkPropsFromTo(to)

  return (
    <StyledContainer {...linkProps} onClick={onClick} colorVariant={colorVariant}>
      <ContentWrapper>
        <IconWrapper colorVariant={iconColorVariant || colorVariant}>{icon}</IconWrapper>
        <BodyWrapper variant={xsMatch ? 'h400' : 'h300'}>
          {label}
          <SvgActionChevronR />
        </BodyWrapper>
      </ContentWrapper>
    </StyledContainer>
  )
}
