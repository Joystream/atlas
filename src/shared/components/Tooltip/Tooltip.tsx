import React, { useState } from 'react'
import { StyledTooltip, ChildrenContainer } from './Tooltip.style'

export type TooltipProps = {
  text: string
  arrowDisabled?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, arrowDisabled }) => {
  const [isHover, setHover] = useState(false)

  return (
    <StyledTooltip data-text={text} isActive={isHover} arrowDisabled={arrowDisabled}>
      <ChildrenContainer onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {children}
      </ChildrenContainer>
    </StyledTooltip>
  )
}

export default Tooltip
