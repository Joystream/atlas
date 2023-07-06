import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar, AvatarSize } from '@/components/Avatar'
import { sizes } from '@/styles'

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
  margin-right: ${({ withHandle, size }) => (withHandle ? (size === 40 ? sizes(4) : sizes(3)) : 0)};
`

export const TitleWrapper = styled.div<{ followButton?: boolean }>`
  flex: ${({ followButton }) => followButton && 1};
  display: flex;
  align-items: center;
`

export const FollowButtonWrapper = styled.div`
  margin-left: auto;
`

type StyledLinkProps = {
  disabled?: boolean
}

export const StyledLink = styled(Link)<StyledLinkProps>`
  text-decoration: none;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`
