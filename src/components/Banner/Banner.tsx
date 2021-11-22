import React, { ReactNode } from 'react'

import { IconButton } from '@/components/_buttons/IconButton'
import { SvgAlertError, SvgAlertInfo, SvgAlertSuccess, SvgAlertWarning, SvgGlyphClose } from '@/components/_icons'

import {
  BannerActionButton,
  BannerButtonsContainer,
  BannerDescription,
  BannerHeader,
  BannerIconContainer,
  BannerTitle,
  BannerWrapper,
} from './Banner.styles'

export type BannerVariant = 'primary' | 'secondary' | 'tertiary'

type BannerIconType = 'success' | 'error' | 'info' | 'warning'

const ICON_TYPE_TO_ICON: Record<BannerIconType, ReactNode> = {
  info: <SvgAlertInfo />,
  success: <SvgAlertSuccess />,
  error: <SvgAlertError />,
  warning: <SvgAlertWarning />,
}

export type BannerProps = {
  title?: string
  description?: string
  className?: string
  variant?: BannerVariant
  icon?: BannerIconType
  onExitClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  actionText?: string
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const Banner: React.FC<BannerProps> = ({
  title,
  description,
  className,
  variant = 'primary',
  icon,
  actionText,
  onExitClick,
  onActionClick,
}) => {
  return (
    <BannerWrapper className={className} variant={variant}>
      <BannerHeader>
        {icon && <BannerIconContainer>{ICON_TYPE_TO_ICON[icon]}</BannerIconContainer>}
        <BannerTitle variant="subtitle2">{title}</BannerTitle>
        <BannerButtonsContainer>
          {actionText && (
            <BannerActionButton variant="tertiary" onClick={onActionClick}>
              {actionText}
            </BannerActionButton>
          )}
          <IconButton aria-label="close dialog" onClick={onExitClick} variant="tertiary" size="small">
            <SvgGlyphClose />
          </IconButton>
        </BannerButtonsContainer>
      </BannerHeader>
      {description && <BannerDescription variant="body2">{description}</BannerDescription>}
    </BannerWrapper>
  )
}
