import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'

import { colors } from '@/shared/theme'

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

const SkeletonLoaderContainer = styled.div<SkeletonLoaderProps>`
  width: ${({ width = '100%' }) => getPropValue(width)};
  height: ${({ height = '100%' }) => getPropValue(height)};
  margin-bottom: ${({ bottomSpace = 0 }) => getPropValue(bottomSpace)};
  border-radius: ${({ rounded = false }) => (rounded ? '100%' : '0')};
  background-color: ${colors.gray['800']};
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
    ${colors.gray['700']}00 15%,
    ${colors.gray['700']}3F 25%,
    ${colors.gray['700']}7F 30%,
    ${colors.gray['700']}FF 48%,
    ${colors.gray['700']}FF 52%,
    ${colors.gray['700']}7F 70%,
    ${colors.gray['700']}3F 75%,
    ${colors.gray['700']}00 85%
  );
  animation: ${pulse} 2s linear infinite;
`
