import React from 'react'

import { StyledRcSlider } from './Slider.styles'

export type SliderProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
}

export const Slider: React.FC<SliderProps> = ({
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  disabled,
}) => {
  return (
    <StyledRcSlider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      className={className}
      disabled={disabled}
    />
  )
}
