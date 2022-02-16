import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

type NotificationWrapperProps = {
  read?: boolean
  selected?: boolean
  loading?: boolean
}

const getNotificationWrapperStyles = ({ read, selected, loading }: NotificationWrapperProps) => {
  if (selected) {
    return css`
      background-color: ${cVar('colorBackgroundElevated')};
    `
  }
  if (!read) {
    return css`
      background-color: ${cVar('colorBackground')};

      :hover {
        background-color: ${cVar('colorBackgroundStrong')};
      }
    `
  }
  if (loading) {
    return
  }
  return css`
    background-color: ${cVar('colorBackgroundMuted')};

    :hover {
      background-color: ${cVar('colorBackground')};
    }
  `
}

const getReadNotificationVariant = ({ read }: NotificationWrapperProps) =>
  !read &&
  css`
    ::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
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
  padding: ${sizes(4)} ${sizes(5)};
  transition: background-color ${cVar('animationTransitionFast')};
`

export const Title = styled.div`
  margin-bottom: ${sizes(0.5)};
`

export const AvatarWrapper = styled.div`
  margin: 0 ${sizes(4)};
`

export const Content = styled.div`
  width: 100%;
`
