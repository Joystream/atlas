import React from 'react'
import { StyledRcSlider } from './Slider.style'

export type SliderProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

const Slider: React.FC<SliderProps> = ({ value = 50, onChange, min = 0, max = 100, step = 1, className }) => {
  return <StyledRcSlider value={value} onChange={onChange} min={min} max={max} step={step} className={className} />
}

export default Slider
