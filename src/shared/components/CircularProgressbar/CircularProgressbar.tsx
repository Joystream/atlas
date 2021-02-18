import * as React from 'react'
import { SVG, Background, Trail, StyledPath } from './CircularProgressbar.style'

export const VIEWBOX_WIDTH = 100
export const VIEWBOX_HEIGHT = 100
export const VIEWBOX_HEIGHT_HALF = VIEWBOX_HEIGHT / 2
export const VIEWBOX_CENTER_X = VIEWBOX_WIDTH / 2
export const VIEWBOX_CENTER_Y = VIEWBOX_HEIGHT / 2

export type CircularProgressbarProps = {
  value: number
  circleRatio?: number
  counterClockwise?: boolean
  maxValue?: number
  minValue?: number
  strokeWidth?: number
  background?: boolean
  backgroundPadding?: number
}

const CircularProgressbar: React.FC<CircularProgressbarProps> = ({
  value,
  background = false,
  backgroundPadding = 0,
  circleRatio = 1,
  counterClockwise = false,
  maxValue = 100,
  minValue = 0,
  strokeWidth = 15,
}) => {
  const getBackgroundPadding = () => (background ? backgroundPadding : 0)
  // The radius of the path is defined to be in the middle, so in order for the path to
  // fit perfectly inside the 100x100 viewBox, need to subtract half the strokeWidth
  const getPathRadius = () => VIEWBOX_HEIGHT_HALF - strokeWidth / 2 - getBackgroundPadding()
  // Ratio of path length to trail length, as a value between 0 and 1
  const getPathRatio = () => {
    const boundedValue = Math.min(Math.max(value, minValue), maxValue)
    return (boundedValue - minValue) / (maxValue - minValue)
  }
  const pathRadius = getPathRadius()
  const pathRatio = getPathRatio()
  return (
    <>
      <SVG viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
        {background ? <Background cx={VIEWBOX_CENTER_X} cy={VIEWBOX_CENTER_Y} r={VIEWBOX_HEIGHT_HALF} /> : null}
        <Trail
          counterClockwise={counterClockwise}
          dashRatio={circleRatio}
          pathRadius={pathRadius}
          strokeWidth={strokeWidth}
        />
        <StyledPath
          counterClockwise={counterClockwise}
          dashRatio={pathRatio * circleRatio}
          pathRadius={pathRadius}
          strokeWidth={strokeWidth}
        />
      </SVG>
    </>
  )
}

export default CircularProgressbar
