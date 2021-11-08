import Tippy from '@tippyjs/react/headless'
import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgGlyphInfo } from '@/components/icons'
import { transitions } from '@/theme'

import { Arrow, IconWrapper, StyledTooltip, TooltipHeader, TooltipText } from './Tooltip.style'

type Placement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'top'
export type TooltipProps = {
  text?: string
  headerText?: string
  icon?: boolean
  placement?: Placement
  offsetX?: number
  offsetY?: number
  arrowDisabled?: boolean
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  headerText,
  icon,
  children,
  placement = 'bottom-start',
  offsetX = 0,
  offsetY = 8,
  arrowDisabled,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  if (!text) {
    return <>{children}</>
  }
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
          <StyledTooltip {...attrs} headerText={!!headerText}>
            <TooltipHeader>
              {icon && (
                <IconWrapper>
                  <SvgGlyphInfo />
                </IconWrapper>
              )}
              {headerText && <TooltipText variant="overhead">{headerText}</TooltipText>}
            </TooltipHeader>

            <TooltipText withIcon={!!icon} variant="caption">
              {text}
            </TooltipText>

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
