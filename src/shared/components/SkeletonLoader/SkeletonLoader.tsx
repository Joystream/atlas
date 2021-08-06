import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { darken } from 'polished'

import { colors } from '@/shared/theme'

type SkeletonLoaderProps = {
  width?: string | number
  height?: string | number
  bottomSpace?: string | number
  rounded?: boolean
}

const getPropValue = (v: string | number) => (typeof v === 'string' ? v : `${v}px`)

const pulse = keyframes`
  0, 100% { 
    background-color: ${colors.gray[400]}
  }
  50% {
    background-color: ${darken(0.15, colors.gray[400])}
  }
`

export const SkeletonLoader = styled.div<SkeletonLoaderProps>`
  width: ${({ width = '100%' }) => getPropValue(width)};
  height: ${({ height = '100%' }) => getPropValue(height)};
  margin-bottom: ${({ bottomSpace = 0 }) => getPropValue(bottomSpace)};
  border-radius: ${({ rounded = false }) => (rounded ? '100%' : '0')};
  background-color: ${colors.gray['400']};
  animation: ${pulse} 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`
