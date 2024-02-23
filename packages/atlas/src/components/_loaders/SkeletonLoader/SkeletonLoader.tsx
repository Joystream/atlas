import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { FC, HTMLAttributes } from 'react'

import { cVar } from '@/styles/generated/variables'

export type SkeletonLoaderProps = {
  width?: string | number
  height?: string | number
  bottomSpace?: string | number
  rounded?: boolean
} & HTMLAttributes<HTMLDivElement>

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

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({ className, ...props }) => (
  <SkeletonLoaderContainer {...props} className={className}>
    <SkeletonLoaderAnimated {...props} />
  </SkeletonLoaderContainer>
)

const SkeletonLoaderContainer = styled.div<SkeletonLoaderProps>`
  min-width: ${({ width = '100%' }) => getPropValue(width)};
  min-height: ${({ height = '100%' }) => getPropValue(height)};
  margin-bottom: ${({ bottomSpace = 0 }) => getPropValue(bottomSpace)};
  border-radius: ${({ rounded = false }) => (rounded ? '100%' : '0')};
  background-color: ${cVar('colorCoreNeutral800Lighten')};
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
    rgba(0 0 0 / 0) 15%,
    ${cVar('colorCoreNeutral900Lighten')} 30%,
    ${cVar('colorCoreNeutral800Lighten')} 48%,
    ${cVar('colorCoreNeutral800Lighten')} 52%,
    ${cVar('colorCoreNeutral900Lighten')} 70%,
    rgba(0 0 0 / 0) 85%
  );
  animation: ${pulse} 1.5s linear infinite;
`
