import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SkeletonLoader } from '@/shared/components'
import { colors, sizes, typography } from '@/shared/theme'

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

export const Handle = styled.span<HandleProps>`
  display: inline-block;
  font-family: ${typography.fonts.headers};
  font-size: 1rem;
  line-height: 1;
  font-weight: bold;
  color: ${colors.white};
  margin-left: ${({ withAvatar }) => (withAvatar ? sizes(2) : 0)};
`

export const HandleSkeletonLoader = styled(SkeletonLoader)<HandleProps>`
  margin-left: ${({ withAvatar }) => (withAvatar ? sizes(2) : 0)};
`
