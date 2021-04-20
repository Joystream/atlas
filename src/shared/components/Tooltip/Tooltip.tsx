import React, { useState } from 'react'
import Tippy from '@tippyjs/react/headless'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { StyledTooltip, TooltipText, IconWrapper, Arrow } from './Tooltip.style'
import { SvgGlyphInfo } from '@/shared/icons'

type Placement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
export type TooltipProps = {
  text: string
  icon?: boolean
  placement?: Placement
  offsetX?: number
  offsetY?: number
  arrowDisabled?: boolean
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  icon,
  children,
  placement = 'bottom-start',
  offsetX = 0,
  offsetY = 8,
  arrowDisabled,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <Tippy
      onMount={() => setIsVisible(true)}
      onHide={() => setIsVisible(false)}
      placement={placement}
      offset={[offsetX, offsetY]}
      render={(attrs) => (
        <CSSTransition
          in={isVisible}
          timeout={parseInt(transitions.timings.sharp)}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <StyledTooltip {...attrs}>
            {icon && (
              <IconWrapper>
                <SvgGlyphInfo />
              </IconWrapper>
            )}
            <TooltipText variant="caption">{text}</TooltipText>
            {!arrowDisabled && <Arrow />}
          </StyledTooltip>
        </CSSTransition>
      )}
    >
      <span tabIndex={0} className={className}>
        {children}
      </span>
    </Tippy>
  )
}

export default Tooltip
