import styled from '@emotion/styled'
import React from 'react'

import { Tooltip } from '@/components/Tooltip'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgGlyphEdit } from '@/components/_icons'
import { colors, sizes } from '@/theme'

type StateProps = {
  tooltipText: string
}

type PullUpProps = StateProps & {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const PullUp: React.FC<PullUpProps> = ({ onClick, tooltipText }) => (
  <Tooltip text={tooltipText} placement="top" arrowDisabled offsetY={16} offsetX={1}>
    <StyledIconButton variant="tertiary" onClick={onClick}>
      <SvgGlyphEdit />
    </StyledIconButton>
  </Tooltip>
)

const StyledIconButton = styled(IconButton)`
  background-color: black;
  border-radius: unset;
  padding: ${sizes(2)};

  :hover {
    background-color: ${colors.gray[600]};
  }
`
