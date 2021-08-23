import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { Text } from '@/shared/components/Text'
import { sizes } from '@/shared/theme'

type ContainerProps = {
  disabled?: boolean
}

export const Container = styled(Link)<ContainerProps>`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`

type HandleProps = {
  withAvatar: boolean
}

export const StyledText = styled(Text)<HandleProps>`
  margin-left: ${({ withAvatar }) => (withAvatar ? sizes(2) : 0)};
`

export const HandleSkeletonLoader = styled(SkeletonLoader)<HandleProps>`
  margin-left: ${({ withAvatar }) => (withAvatar ? sizes(2) : 0)};
`
