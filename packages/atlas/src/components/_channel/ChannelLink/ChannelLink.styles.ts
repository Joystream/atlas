import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar, AvatarSize } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { oldColors, sizes } from '@/styles'

export const Container = styled.div`
  width: 100%;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
`

type AvatarProps = {
  withHandle: boolean
  size: AvatarSize
}

export const StyledAvatar = styled(Avatar)<AvatarProps>`
  margin-right: ${({ withHandle, size }) => (withHandle ? (size === 'small' ? sizes(4) : sizes(3)) : 0)};
`

type HandleProps = {
  isSecondary: boolean
}

const secondaryTextCss = `
  color: ${oldColors.gray[200]};
`

export const StyledText = styled(Text)<HandleProps>`
  ${({ isSecondary }) => isSecondary && secondaryTextCss}
`

export const TitleWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`

export const FollowButton = styled(Button)`
  margin-left: auto;
`

export const Follows = styled(Text)`
  margin-top: ${sizes(1)};
`

type StyledLinkProps = {
  disabled?: boolean
}

export const StyledLink = styled(Link)<StyledLinkProps>`
  text-decoration: none;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`
