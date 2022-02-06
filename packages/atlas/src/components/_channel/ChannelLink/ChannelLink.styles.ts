import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { oldColors, sizes } from '@/styles'

type ContainerProps = {
  disabled?: boolean
}

export const Container = styled(Link)<ContainerProps>`
  width: 100%;
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
