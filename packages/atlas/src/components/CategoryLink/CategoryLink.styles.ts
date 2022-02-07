import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { sizes } from '@/styles'
import { square } from '@/styles'

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
  withHandle: boolean
}

export const IconWrapper = styled.div<IconWrapperProps>`
  ${square(40)}
  position: relative;
  border-radius: 50%;
  overflow: hidden;
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
