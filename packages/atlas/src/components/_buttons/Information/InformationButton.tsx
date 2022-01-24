import React from 'react'

import { Tooltip, TooltipProps } from '@/components/Tooltip'

import { StyledSvgActionInformative } from './Information.styles'

import { IconButton } from '../IconButton'

export type InformationProps = {
  tooltip?: TooltipProps
  className?: string
}

export const Information: React.FC<InformationProps> = ({ tooltip, className }) => {
  return (
    <Tooltip {...tooltip} arrowDisabled placement="top">
      <IconButton className={className} variant="tertiary" size="small">
        <StyledSvgActionInformative />
      </IconButton>
    </Tooltip>
  )
}
