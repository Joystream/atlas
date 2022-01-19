import React from 'react'

import { Tooltip, TooltipProps } from '@/components/Tooltip'
import { SvgActionInformative } from '@/components/_icons'

import { IconButton } from '../IconButton'

export type InformationButtonProps = {
  tooltip: TooltipProps
  className?: string
}

export const InformationButton: React.FC<InformationButtonProps> = ({ tooltip, className }) => {
  return (
    <Tooltip {...tooltip} arrowDisabled placement="top">
      <IconButton className={className} variant="tertiary" size="small">
        <SvgActionInformative />
      </IconButton>
    </Tooltip>
  )
}
