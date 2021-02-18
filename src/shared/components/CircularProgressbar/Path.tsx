import React from 'react'
import { VIEWBOX_CENTER_X, VIEWBOX_CENTER_Y } from './CircularProgressbar'

type PathProps = {
  className?: string
  counterClockwise: boolean
  dashRatio: number
  pathRadius: number
  strokeWidth: number
}
export const Path: React.FC<PathProps> = ({ className, counterClockwise, dashRatio, pathRadius, strokeWidth }) => {
  return (
    <path
      className={className}
      style={Object.assign({}, getDashStyle(counterClockwise, dashRatio, pathRadius))}
      d={getPathDescription(pathRadius, counterClockwise)}
      strokeWidth={strokeWidth}
      fillOpacity={0}
    />
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
