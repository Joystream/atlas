import React, { useState } from 'react'
import { StyledTooltip, ChildrenContainer } from './Tooltip.style'

export type TooltipProps = {
  text: string
  arrowDisabled?: boolean
  darkenContent?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, arrowDisabled, darkenContent = true }) => {
  const [isActive, setActive] = useState(false)

  return (
    <StyledTooltip data-text={text} isActive={isActive} arrowDisabled={arrowDisabled}>
      <ChildrenContainer
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        darkenContent={darkenContent}
      >
        {children}
      </ChildrenContainer>
    </StyledTooltip>
  )
}

export default Tooltip
