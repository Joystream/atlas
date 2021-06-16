import React from 'react'

import { SvgGlyphNewTab } from '@/shared/icons'

import { IconButton } from '../IconButton'
import { Tooltip } from '../Tooltip'

type StateProps = {
  disabled: boolean
}
type PullUpProps = StateProps & {
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}

export const PullUp: React.FC<PullUpProps> = ({ disabled, onClick }) => (
  <Tooltip
    text={disabled ? 'Video already added to edit list' : 'Open in new tab'}
    placement="top-start"
    offsetY={16}
    offsetX={1}
  >
    <IconButton disabled={disabled} variant="tertiary" onClick={onClick}>
      <SvgGlyphNewTab />
    </IconButton>
  </Tooltip>
)
