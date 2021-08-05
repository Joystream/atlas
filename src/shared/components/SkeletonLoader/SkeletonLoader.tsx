import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'

import { colors } from '@/shared/theme'

type SkeletonLoaderProps = {
  width?: string | number
  height?: string | number
  bottomSpace?: string | number
  rounded?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const getPropValue = (v: string | number) => (typeof v === 'string' ? v : `${v}px`)

const pulse = keyframes`
  0 { 
    transform: translateX(-100%)
  }
  100% {
    transform: translateX(100%)
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
  background-color: ${colors.gray['900']};
  overflow: hidden;

  /* Safari fix
     https://stackoverflow.com/questions/49066011/overflow-hidden-with-border-radius-not-working-on-safari */
  transform: translateZ(0);
`

const SkeletonLoaderAnimated = styled.div<SkeletonLoaderProps>`
  height: ${({ height = '100%' }) => getPropValue(height)};
  transform: translateX(-100%);
  background: linear-gradient(
    104deg,
    ${colors.gray['800']}00 15%,
    ${colors.gray['800']}3F 25%,
    ${colors.gray['800']}7F 30%,
    ${colors.gray['800']}FF 48%,
    ${colors.gray['800']}FF 52%,
    ${colors.gray['800']}7F 70%,
    ${colors.gray['800']}3F 75%,
    ${colors.gray['800']}00 85%
  );
  animation: ${pulse} 2s cubic-bezier(0, 0.1, 0.2, 1) infinite;
`
