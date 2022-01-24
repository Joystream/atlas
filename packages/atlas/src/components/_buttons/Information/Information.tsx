import React from 'react'

import { Tooltip, TooltipProps } from '@/components/Tooltip'
import { isMobile } from '@/utils/browser'

import { IconWrapper, StyledSvgActionInformative, TouchableWrapper } from './Information.styles'

export type InformationProps = TooltipProps & {
  className?: string
}

export const Information: React.FC<InformationProps> = ({ className, ...tooltipProps }) => {
  return (
    <TouchableWrapper isMobile={isMobile()}>
      <Tooltip {...tooltipProps} arrowDisabled offsetY={4} offsetX={4}>
        <IconWrapper className={className}>
          <StyledSvgActionInformative />
        </IconWrapper>
      </Tooltip>
    </TouchableWrapper>
  )
}
