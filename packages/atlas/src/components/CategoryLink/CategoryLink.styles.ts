import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { sizes } from '@/styles'
import { square } from '@/styles'
import { hexToRgb } from '@/styles/utils'

type ContainerProps = {
  disabled?: boolean
}

export const Container = styled(Link)<ContainerProps>`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`

type IconWrapperProps = {
  color: string
  withHandle: boolean
}

export const IconWrapper = styled.div<IconWrapperProps>`
  ${square(40)}
  border-radius: 50%;
  background-color: ${({ color }) => `rgba(${hexToRgb(color)}, 0.2) `};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ withHandle }) => (withHandle ? sizes(3) : 0)};

  path {
    fill: ${({ color }) => color};
  }
`

export const StyledSkeletonLoader = styled(SkeletonLoader)<{ withHandle: boolean }>`
  margin-right: ${({ withHandle }) => (withHandle ? sizes(3) : 0)};
`
