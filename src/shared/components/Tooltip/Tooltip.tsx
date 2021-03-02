import React, { useState } from 'react'
import { StyledTooltip, ChildrenContainer } from './Tooltip.style'

export type TooltipProps = {
  text: string
  above?: boolean
  right?: boolean
  offsetY?: number
  arrowDisabled?: boolean
  darkenContent?: boolean
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  above,
  right,
  offsetY,
  arrowDisabled,
  darkenContent = true,
  className,
}) => {
  const [isActive, setActive] = useState(false)

  return (
    <StyledTooltip
      data-text={text}
      isActive={isActive}
      arrowDisabled={arrowDisabled}
      above={above}
      right={right}
      offsetY={offsetY}
      className={className}
    >
      <ChildrenContainer
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        darkenContent={darkenContent}
        tabIndex={0}
      >
        {children}
      </ChildrenContainer>
    </StyledTooltip>
  )
}

export default Tooltip
