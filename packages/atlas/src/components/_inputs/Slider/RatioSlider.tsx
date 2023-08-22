import { ChangeEventHandler, forwardRef, useMemo, useState } from 'react'

import { sizes } from '@/styles'
import { createId } from '@/utils/createId'

import { Range, Track, Wrapper } from './RatioSlider.styles'

type RatioSliderProps = {
  id?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  value?: number
  onChange?: (value: number) => void
}

export const RatioSlider = forwardRef<HTMLInputElement, RatioSliderProps>(
  ({ min = 0, max = 100, step = 10, defaultValue = 50, value: controlledValue, onChange, id }, ref) => {
    const [internalValue, setInternalValue] = useState<number>(defaultValue)
    const value = controlledValue ?? internalValue

    const handleChange: ChangeEventHandler<HTMLInputElement> = useMemo(
      () =>
        typeof controlledValue === 'undefined'
          ? (evt) => setInternalValue(Number(evt.target.value))
          : (evt) => onChange?.(Number(evt.target.value)),
      [controlledValue, onChange]
    )

    const length = max - min
    const valuePercent = `${(value / length) * 100}%`

    const steps = useMemo(() => {
      const stepPercent = (step / length) * 100
      return Array.from({ length: Math.ceil(length / step) + 1 }).map(
        (_, index) => `${Math.min(index * stepPercent, 100)}%`
      )
    }, [step, length])

    const internalId = useMemo(() => id ?? createId(), [id])

    return (
      <Wrapper>
        <Range ref={ref} type="range" min={min} max={max} step={step} value={value} onChange={handleChange} />

        <Track xmlns="http://www.w3.org/2000/svg">
          <circle className="knob" cx={valuePercent} cy={sizes(3)} r={sizes(2)} />

          <mask id={`cutout-mask-${internalId}`}>
            <rect x="-5%" y="0%" width="110%" height="100%" fill="#fff" />
            <circle className="cutout-mask" cx={valuePercent} cy={sizes(3)} r={sizes(3)} />
          </mask>

          <g className="rail" mask={`url(#cutout-mask-${internalId})`}>
            <line className="rail-left" x1="0%" x2={valuePercent} y1={sizes(3)} y2={sizes(3)} />
            <line className="rail-rigth" x1={valuePercent} x2="100%" y1={sizes(3)} y2={sizes(3)} />

            <g className="steps">
              {steps.map((x, index) => {
                const cls = Math.min(index * step, max) <= value ? 'active' : ''
                return <line key={index} className={cls} x1={x} x2={x} y1={sizes(3 / 2)} y2={sizes(9 / 2)} radius={4} />
              })}
            </g>
          </g>

          <text x="0%" y={sizes(10)}>
            {min}%
          </text>
          <text x="50%" y={sizes(10)}>
            {value}%
          </text>
          <text x="100%" y={sizes(10)}>
            {max}%
          </text>
        </Track>
      </Wrapper>
    )
  }
)

RatioSlider.displayName = 'RatioSlider'
