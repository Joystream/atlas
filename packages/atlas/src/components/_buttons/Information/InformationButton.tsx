import React from 'react'

import { Tooltip, TooltipProps } from '@/components/Tooltip'
import { isMobile } from '@/utils/browser'

import { IconWrapper, StyledSvgActionInformative, TouchableWrapper } from './Information.styles'

export type InformationProps = {
  tooltip?: TooltipProps
  className?: string
}

export const Information: React.FC<InformationProps> = ({ tooltip, className }) => {
  const mobile = isMobile()
  return (
    <Tooltip {...tooltip} arrowDisabled placement="top" offsetY={4} offsetX={4}>
      {mobile ? (
        <TouchableWrapper>
          <IconWrapper className={className}>
            <StyledSvgActionInformative />
          </IconWrapper>
        </TouchableWrapper>
      ) : (
        <IconWrapper className={className}>
          <StyledSvgActionInformative />
        </IconWrapper>
      )}
    </Tooltip>
  )
}
