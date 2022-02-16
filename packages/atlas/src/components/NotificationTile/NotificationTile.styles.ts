import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

type Variant = 'default' | 'compact'

type NotificationWrapperProps = {
  read?: boolean
  selected?: boolean
  loading?: boolean
  variant: Variant
}

const getNotificationWrapperStyles = ({ read, selected, loading, variant }: NotificationWrapperProps) => {
  if (selected) {
    return css`
      background-color: ${cVar('colorBackgroundElevated')};
    `
  }
  if (!read) {
    if (variant === 'default') {
      return css`
        background-color: ${cVar('colorBackground')};

        :hover {
          background-color: ${cVar('colorBackgroundStrong')};
        }
      `
    }
    return css`
      background-color: ${cVar('colorBackgroundMutedAlpha')};

      :hover {
        background-color: ${cVar('colorBackgroundStrong')};
      }
    `
  }
  if (loading) {
    return
  }
  if (variant === 'default') {
    return css`
      background-color: ${cVar('colorBackgroundMuted')};

      :hover {
        background-color: ${cVar('colorBackground')};
      }
    `
  }
  return css`
    background-color: transparent;

    :hover {
      background-color: ${cVar('colorBackground')};
    }
  `
}

const getReadNotificationVariant = ({ read, variant }: NotificationWrapperProps) =>
  !read &&
  css`
    ::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: ${variant === 'default' ? 4 : 2}px;
      height: 100%;
      background-color: ${cVar('colorBackgroundPrimary')};
    }
  `

export const Wrapper = styled.div<NotificationWrapperProps>`
  ${getNotificationWrapperStyles};
  ${getReadNotificationVariant};

  display: flex;
  align-items: center;
  position: relative;
  padding: ${({ variant }) => (variant === 'default' ? sizes(4) : `${sizes(2)} ${sizes(4)}`)};
  padding-left: ${({ variant }) => variant === 'default' && sizes(5)};
  transition: background-color ${cVar('animationTransitionFast')};
`

export const Title = styled.div`
  margin-bottom: ${sizes(0.5)};
`

type AvatarWrapperProps = {
  tileVariant: Variant
}

export const AvatarWrapper = styled.div<AvatarWrapperProps>`
  margin: 0 ${sizes(4)};
  margin-left: ${({ tileVariant }) => sizes(tileVariant === 'default' ? 4 : 0)};
  margin-right: ${({ tileVariant }) => sizes(tileVariant === 'default' ? 4 : 3)};
`

export const Content = styled.div`
  width: 100%;
`
