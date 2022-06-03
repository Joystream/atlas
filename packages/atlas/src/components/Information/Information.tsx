import React from 'react'

import { Tooltip, TooltipProps } from '@/components/Tooltip'
import { isMobile } from '@/utils/browser'

import { IconWrapper, InformationWrapper, StyledSvgActionInformative, TouchableWrapper } from './Information.styles'

export type InformationProps = TooltipProps & {
  className?: string
}

export const Information: React.FC<InformationProps> = ({ className, ...tooltipProps }) => {
  return (
    <InformationWrapper>
      <Tooltip {...tooltipProps} arrowDisabled offsetY={8} offsetX={8} hideOnClick={false}>
        <TouchableWrapper isMobile={isMobile()}>
          <IconWrapper className={className}>
            <StyledSvgActionInformative />
          </IconWrapper>
        </TouchableWrapper>
      </Tooltip>
    </InformationWrapper>
  )
}
