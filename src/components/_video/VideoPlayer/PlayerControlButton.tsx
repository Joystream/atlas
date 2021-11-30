import React, { useEffect, useState } from 'react'

import { ControlButton, ControlButtonTooltip, ControlButtonTooltipText } from './PlayerControlButton.styles'

type PlayerControlButtonProps = {
  className?: string
  showTooltipOnlyOnFocus?: boolean
  tooltipPosition?: 'left' | 'right'
  onClick?: (e: React.MouseEvent) => void
  tooltipText?: string
}

export const PlayerControlButton: React.FC<PlayerControlButtonProps> = ({
  children,
  onClick,
  tooltipText,
  tooltipPosition,
  className,
  showTooltipOnlyOnFocus,
}) => {
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
      showTooltipOnlyOnFocus={showTooltipOnlyOnFocus}
      className={className}
      onFocus={handleButtonFocus}
      disableFocus={disableFocus}
      onClick={onClick}
    >
      {children}
      <ControlButtonTooltip tooltipPosition={tooltipPosition}>
        <ControlButtonTooltipText variant="t100">{tooltipText}</ControlButtonTooltipText>
      </ControlButtonTooltip>
    </ControlButton>
  )
}
