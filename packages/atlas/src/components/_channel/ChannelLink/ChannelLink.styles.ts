import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar, AvatarSize } from '@/components/Avatar'
import { media, sizes } from '@/styles'

export const Container = styled.div`
  width: 100%;
  display: inline-grid;
  align-items: center;
  text-decoration: none;
  grid-template-columns: auto 1fr;
  ${media.xs} {
    grid-template-columns: auto 1fr auto;
    flex-wrap: no-wrap;
  }
`

type AvatarProps = {
  withHandle: boolean
  size: AvatarSize
}

export const StyledAvatar = styled(Avatar)<AvatarProps>`
  margin-right: ${({ withHandle, size }) => (withHandle ? (size === 40 ? sizes(4) : sizes(3)) : 0)};
`

export const ActionButtons = styled.div`
  display: flex;
  grid-column: span 2;
  gap: ${sizes(4)};
  margin-top: ${sizes(4)};

  button,
  > div {
    width: 100%;
  }
  ${media.xs} {
    grid-column: auto;
    margin-top: 0;
    justify-content: flex-end;

    button,
    > div {
      width: auto;
    }
  }
`

type StyledLinkProps = {
  disabled?: boolean
}

export const StyledLink = styled(Link)<StyledLinkProps>`
  text-decoration: none;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`
