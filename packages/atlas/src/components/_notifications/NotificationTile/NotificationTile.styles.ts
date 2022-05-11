import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { ListItem } from '@/components/ListItem'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, sizes } from '@/styles'

type Variant = 'default' | 'compact'

type NotificationWrapperProps = {
  read?: boolean
  selected?: boolean
  loading?: boolean
  variant?: Variant
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

const getReadNotificationVariant = ({ read, variant, loading }: NotificationWrapperProps) =>
  !read &&
  !loading &&
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

const shouldForwardWrapperProps = (prop: PropertyKey) => prop !== 'loading' && prop !== 'read'

export const Wrapper = styled(Link, { shouldForwardProp: shouldForwardWrapperProps })<NotificationWrapperProps>`
  ${getNotificationWrapperStyles};
  ${getReadNotificationVariant};

  display: flex;
  text-decoration: none;
  align-items: center;
  position: relative;
  padding: ${({ variant }) => (variant === 'default' ? sizes(4) : `${sizes(2)} ${sizes(4)}`)};
  padding-left: ${({ variant }) => variant === 'default' && sizes(5)};
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

export const CheckboxSkeleton = styled(SkeletonLoader)`
  border-radius: 2px;
`

type StyledListItemProps = {
  read?: boolean
  variant: Variant
  loading?: boolean
}

const getListItemStyles = ({ read, loading }: StyledListItemProps) => {
  if (loading) {
    return
  }
  if (!read) {
    return css`
      background-color: ${cVar('colorBackgroundMutedAlpha')};

      :hover {
        background-color: ${cVar('colorBackgroundStrong')};
      }
    `
  }
}

export const StyledListItem = styled(ListItem)<StyledListItemProps>`
  ${getReadNotificationVariant};
  ${getListItemStyles};

  position: relative;
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`
