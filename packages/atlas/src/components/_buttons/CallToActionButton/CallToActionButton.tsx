import { To } from 'history'
import { FC, MouseEvent, ReactNode } from 'react'

import {
  SvgActionChevronR,
  SvgActionNewTab,
  SvgSidebarExplore,
  SvgSidebarHome,
  SvgSidebarPopular,
} from '@/assets/icons'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
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
export const CTA_MAP: Record<string, CallToActionButtonProps> = {
  home: {
    label: 'Home',
    to: absoluteRoutes.viewer.index(),
    colorVariant: 'yellow',
    icon: <SvgSidebarHome />,
  },
  popular: {
    label: `Popular on ${atlasConfig.general.appName}`,
    to: absoluteRoutes.viewer.popular(),
    colorVariant: 'red',
    icon: <SvgSidebarPopular />,
  },
  discover: {
    label: 'Discover videos',
    to: absoluteRoutes.viewer.discover(),
    colorVariant: 'yellow',
    icon: <SvgSidebarExplore />,
  },
}
