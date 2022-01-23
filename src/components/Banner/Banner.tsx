import React, { ReactNode } from 'react'

import { IconButton } from '@/components/_buttons/IconButton'
import {
  SvgActionClose,
  SvgAlertsError24,
  SvgAlertsInformative24,
  SvgAlertsSuccess24,
  SvgAlertsWarning24,
} from '@/components/_icons'

import { BannerDescription, BannerHeader, BannerTitle, BannerWrapper } from './Banner.styles'

type BannerIconType = 'success' | 'error' | 'info' | 'warning'

const ICON_TYPE_TO_ICON: Record<BannerIconType, ReactNode> = {
  info: <SvgAlertsInformative24 />,
  success: <SvgAlertsSuccess24 />,
  error: <SvgAlertsError24 />,
  warning: <SvgAlertsWarning24 />,
}

export type BannerProps = {
  title?: string
  description?: string
  className?: string
  icon?: BannerIconType
  onExitClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const Banner: React.FC<BannerProps> = ({ title, description, className, icon, onExitClick }) => {
  return (
    <BannerWrapper className={className}>
      <BannerHeader>
        {icon && ICON_TYPE_TO_ICON[icon]}
        <BannerTitle variant="h400">{title}</BannerTitle>
        <IconButton aria-label="close dialog" onClick={onExitClick} variant="tertiary" size="small">
          <SvgActionClose />
        </IconButton>
      </BannerHeader>
      {description && (
        <BannerDescription as="p" variant="t200" secondary>
          {icon && !title && ICON_TYPE_TO_ICON[icon]}
          {description}
        </BannerDescription>
      )}
    </BannerWrapper>
  )
}
