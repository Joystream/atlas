import { MouseEvent, PropsWithChildren, forwardRef, useEffect, useState } from 'react'

import { ControlButton, ControlButtonTooltip, ControlButtonTooltipText } from './PlayerControlButton.styles'

type PlayerControlButtonProps = PropsWithChildren<{
  className?: string
  showTooltipOnlyOnFocus?: boolean
  tooltipPosition?: 'left' | 'right'
  onClick?: (e: MouseEvent) => void
  tooltipText?: string
  isDisabled?: boolean
  tooltipEnabled?: boolean
}>

export const PlayerControlButton = forwardRef<HTMLButtonElement, PlayerControlButtonProps>(
  (
    {
      children,
      onClick,
      tooltipText,
      tooltipPosition,
      className,
      showTooltipOnlyOnFocus,
      isDisabled,
      tooltipEnabled = true,
    },
    ref
  ) => {
    const [disableFocus, setDisableFocus] = useState(true)

    useEffect(() => {
      if (disableFocus) {
        return
      }
      const handler = () => setDisableFocus(true)
      window.addEventListener('mousemove', handler)
      return () => window.removeEventListener('mousemove', handler)
    }, [disableFocus])

    const handleButtonFocus = () => setDisableFocus(false)
    return (
      <ControlButton
        ref={ref}
        isDisabled={isDisabled}
        showTooltipOnlyOnFocus={showTooltipOnlyOnFocus}
        className={className}
        onFocus={handleButtonFocus}
        disableFocus={disableFocus}
        onClick={onClick}
      >
        {children}
        {tooltipEnabled && !isDisabled && (
          <ControlButtonTooltip tooltipPosition={tooltipPosition}>
            <ControlButtonTooltipText as="span" variant="t100">
              {tooltipText}
            </ControlButtonTooltipText>
          </ControlButtonTooltip>
        )}
      </ControlButton>
    )
  }
)

PlayerControlButton.displayName = 'PlayerControlButton'
