import Tippy from '@tippyjs/react/headless'
import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgAlertsInformative24 } from '@/components/_icons'
import { transitions } from '@/styles'

import { Arrow, IconWrapper, StyledTooltip, TooltipHeader, TooltipText } from './Tooltip.styles'

type Placement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'top'
export type TooltipProps = {
  text?: string
  headerText?: string
  icon?: boolean
  placement?: Placement
  offsetX?: number
  offsetY?: number
  hideOnClick?: boolean | 'toggle'
  arrowDisabled?: boolean
  reference?: Element | React.RefObject<Element> | null | undefined
  footer?: React.ReactNode
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  headerText,
  icon,
  children,
  reference,
  hideOnClick,
  placement = 'bottom-start',
  offsetX = 0,
  offsetY = 8,
  arrowDisabled,
  footer,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  if (!text) {
    return <>{children}</>
  }
  return (
    <Tippy
      onMount={() => setIsVisible(true)}
      hideOnClick={hideOnClick}
      onHide={() => setIsVisible(false)}
      placement={placement}
      reference={reference}
      offset={[offsetX, offsetY]}
      render={(attrs) => (
        <CSSTransition
          in={isVisible}
          timeout={parseInt(transitions.timings.sharp)}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <StyledTooltip {...attrs} headerText={!!headerText} footer={!!footer}>
            <TooltipHeader>
              {icon && (
                <IconWrapper>
                  <SvgAlertsInformative24 />
                </IconWrapper>
              )}
              {headerText && <TooltipText variant="h100">{headerText}</TooltipText>}
            </TooltipHeader>

            <TooltipText withIcon={!!icon} variant="t100">
              {text}
            </TooltipText>
            {footer}
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
