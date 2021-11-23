import styled from '@emotion/styled'
import React from 'react'

import { Tooltip } from '@/components/Tooltip'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionEdit } from '@/components/_icons'
import { oldColors, sizes } from '@/styles'

type StateProps = {
  tooltipText: string
}

type PullUpProps = StateProps & {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const PullUp: React.FC<PullUpProps> = ({ onClick, tooltipText }) => (
  <Tooltip text={tooltipText} placement="top" arrowDisabled offsetY={16} offsetX={1}>
    <StyledIconButton variant="tertiary" onClick={onClick}>
      <SvgActionEdit />
    </StyledIconButton>
  </Tooltip>
)

const StyledIconButton = styled(IconButton)`
  background-color: black;
  border-radius: unset;
  padding: ${sizes(2)};

  :hover {
    background-color: ${oldColors.gray[600]};
  }
`
