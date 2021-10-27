import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'

export type SkeletonLoaderProps = {
  width?: string | number
  height?: string | number
  bottomSpace?: string | number
  rounded?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const getPropValue = (v: string | number) => (typeof v === 'string' ? v : `${v}px`)

const pulse = keyframes`
  0% {
    transform: translateX(0%);
  }
  49.999% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(-100%);
  }
`

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className, ...props }) => (
  <SkeletonLoaderContainer {...props} className={className}>
    <SkeletonLoaderAnimated {...props} />
  </SkeletonLoaderContainer>
)

/**
 *  TODO: All skeleton colors needs to be replaced after introducing design tokens, like the following:
 *  Base
 *  background-color: rgba(187, 217, 246, 0.13); // core.neutral.800.lighten
 *
 *  Gradient wave
 *  background: linear-gradient(
 *    104deg,
 *    rgba(183, 200, 250, 0) 15%,        // core.neutral.900.lighten, with no opacity
 *    rgba(183, 200, 250, 0.06) 30%,     // core.neutral.900.lighten
 *    rgba(187, 217, 246, 0.13) 48%,     // core.neutral.800.lighten
 *    rgba(187, 217, 246, 0.13) 52%,     // core.neutral.800.lighten
 *    rgba(183, 200, 250, 0.06) 70%,     // core.neutral.900.lighten
 *    rgba(183, 200, 250, 0) 85%         // core.neutral.900.lighten, with no opacity
 *  );
 *
 */

const SkeletonLoaderContainer = styled.div<SkeletonLoaderProps>`
  width: ${({ width = '100%' }) => getPropValue(width)};
  height: ${({ height = '100%' }) => getPropValue(height)};
  margin-bottom: ${({ bottomSpace = 0 }) => getPropValue(bottomSpace)};
  border-radius: ${({ rounded = false }) => (rounded ? '100%' : '0')};
  background-color: rgba(187, 217, 246, 0.13);
  overflow: hidden;

  /* Safari fix
     https://stackoverflow.com/questions/49066011/overflow-hidden-with-border-radius-not-working-on-safari */
  transform: translateZ(0);
`

const SkeletonLoaderAnimated = styled.div<SkeletonLoaderProps>`
  height: ${({ height = '100%' }) => getPropValue(height)};
  transform: translateX(0%);
  background: linear-gradient(
    104deg,
    rgba(183, 200, 250, 0) 15%,
    rgba(183, 200, 250, 0.06) 30%,
    rgba(187, 217, 246, 0.13) 48%,
    rgba(187, 217, 246, 0.13) 52%,
    rgba(183, 200, 250, 0.06) 70%,
    rgba(183, 200, 250, 0) 85%
  );
  animation: ${pulse} 1.5s linear infinite;
`
