import React, { useState } from 'react'
import Tippy from '@tippyjs/react/headless'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { Text } from '@/shared/components'
import { StyledTooltip, IconWrapper, Arrow } from './Tooltip.style'
import { SvgGlyphInfo } from '@/shared/icons'

type Placement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
export type TooltipProps = {
  text: string
  icon?: boolean
  placement?: Placement
  arrowDisabled?: boolean
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  icon,
  children,
  placement = 'bottom-start',
  arrowDisabled,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <Tippy
      onMount={() => setIsVisible(true)}
      onHide={() => setIsVisible(false)}
      placement={placement}
      offset={[0, 8]}
      render={(attrs) => (
        <CSSTransition
          in={isVisible}
          timeout={parseInt(transitions.timings.sharp)}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <StyledTooltip {...attrs} className={className}>
            {icon && (
              <IconWrapper>
                <SvgGlyphInfo />
              </IconWrapper>
            )}
            <Text variant="caption">{text}</Text>
            {!arrowDisabled && <Arrow />}
          </StyledTooltip>
        </CSSTransition>
      )}
    >
      <span tabIndex={0}>{children}</span>
    </Tippy>
  )
}

export default Tooltip
