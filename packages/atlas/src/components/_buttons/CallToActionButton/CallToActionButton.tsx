import { To } from 'history'
import { FC, MouseEvent, ReactNode } from 'react'

import { SvgActionChevronR, SvgActionNewTab } from '@/assets/icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getLinkPropsFromTo } from '@/utils/button'

import { BodyWrapper, ColorVariants, ContentWrapper, IconWrapper, StyledContainer } from './CallToActionButton.styles'

export type CallToActionButtonProps = {
  to?: To
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  icon?: ReactNode
  colorVariant?: ColorVariants
  iconColorVariant?: ColorVariants
  label: string
  external?: boolean
}

export const CallToActionButton: FC<CallToActionButtonProps> = ({
  to,
  icon,
  onClick,
  colorVariant = 'blue',
  iconColorVariant,
  label,
  external,
}) => {
  const xsMatch = useMediaMatch('xs')
  const linkProps = getLinkPropsFromTo(to)

  return (
    <StyledContainer {...linkProps} onClick={onClick} colorVariant={colorVariant}>
      <ContentWrapper>
        <IconWrapper colorVariant={iconColorVariant || colorVariant}>{icon}</IconWrapper>
        <BodyWrapper as="span" variant={xsMatch ? 'h400' : 'h300'}>
          {label}
          {external ? <SvgActionNewTab /> : <SvgActionChevronR />}
        </BodyWrapper>
      </ContentWrapper>
    </StyledContainer>
  )
}
