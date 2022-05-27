import { FC } from 'react'

import { Background, SVG, StyledPath, Trail, TrailVariant } from './CircularProgress.styles'

export const VIEWBOX_WIDTH = 100
export const VIEWBOX_HEIGHT = 100
export const VIEWBOX_HEIGHT_HALF = VIEWBOX_HEIGHT / 2
export const VIEWBOX_CENTER_X = VIEWBOX_WIDTH / 2
export const VIEWBOX_CENTER_Y = VIEWBOX_HEIGHT / 2

export type CircularProgressProps = {
  value: number
  circleRatio?: number
  counterClockwise?: boolean
  maxValue?: number
  minValue?: number
  strokeWidth?: number
  background?: boolean
  backgroundPadding?: number
  className?: string
  variant?: TrailVariant
  noTrail?: boolean
}

export const CircularProgress: FC<CircularProgressProps> = ({
  value,
  background = false,
  backgroundPadding = 0,
  circleRatio = 1,
  counterClockwise = false,
  maxValue = 100,
  minValue = 0,
  strokeWidth = 15,
  variant = 'default',
  noTrail,
  className,
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
      <SVG viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className={className}>
        {background ? <Background cx={VIEWBOX_CENTER_X} cy={VIEWBOX_CENTER_Y} r={VIEWBOX_HEIGHT_HALF} /> : null}
        {!noTrail && (
          <Trail
            style={Object.assign({}, getDashStyle(counterClockwise, circleRatio, pathRadius))}
            d={getPathDescription(pathRadius, counterClockwise)}
            variant={variant}
            strokeWidth={strokeWidth}
          />
        )}
        <StyledPath
          strokeWidth={strokeWidth}
          className={className}
          style={Object.assign({}, getDashStyle(counterClockwise, pathRatio * circleRatio, pathRadius))}
          d={getPathDescription(pathRadius, counterClockwise)}
          fillOpacity={0}
        />
      </SVG>
    </>
  )
}

// SVG path description specifies how the path should be drawn
const getPathDescription = (pathRadius: number, counterClockwise: boolean) => {
  const radius = pathRadius
  const rotation = counterClockwise ? 1 : 0

  // Move to center of canvas
  // Relative move to top canvas
  // Relative arc to bottom of canvas
  // Relative arc to top of canvas
  return `
      M ${VIEWBOX_CENTER_X},${VIEWBOX_CENTER_Y}
      m 0,-${radius}
      a ${radius},${radius} ${rotation} 1 1 0,${2 * radius}
      a ${radius},${radius} ${rotation} 1 1 0,-${2 * radius}
    `
}

const getDashStyle = (counterClockwise: boolean, dashRatio: number, pathRadius: number) => {
  const diameter = Math.PI * 2 * pathRadius
  const gapLength = (1 - dashRatio) * diameter
  return {
    // Have dash be full diameter, and gap be full diameter
    strokeDasharray: `${diameter}px ${diameter}px`,
    // Shift dash backward by gapLength, so gap starts appearing at correct distance
    strokeDashoffset: `${counterClockwise ? -gapLength : gapLength}px`,
  }
}
