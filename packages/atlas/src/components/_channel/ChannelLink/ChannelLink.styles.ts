import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

type ContainerProps = {
  disabled?: boolean
}

export const Container = styled(Link)<ContainerProps>`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`

type AvatarProps = {
  withHandle: boolean
}

export const StyledAvatar = styled(Avatar)<AvatarProps>`
  margin-right: ${({ withHandle }) => (withHandle ? sizes(3) : 0)};
`

type HandleProps = {
  isSecondary: boolean
}

const secondaryTextCss = `
  color: ${cVar('colorText')};
`

export const StyledText = styled(Text)<HandleProps>`
  ${({ isSecondary }) => isSecondary && secondaryTextCss}
`
