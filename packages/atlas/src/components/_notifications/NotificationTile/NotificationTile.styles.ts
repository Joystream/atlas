import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { ListItem } from '@/components/ListItem'
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
    background-color: ${cVar('colorBackground')};
  `
}

const getReadNotificationVariant = ({ read, loading }: NotificationWrapperProps) =>
  !read &&
  !loading &&
  css`
    ::after {
      content: '';
      display: block;
      position: absolute;
      left: 5px;
      top: calc(50% - 4px);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${cVar('colorBackgroundPrimaryStrong')};
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
  padding: ${sizes(4)};
  padding-left: ${({ variant }) => variant === 'default' && sizes(5)};
  transition: background-color ${cVar('animationTransitionFast')};
`

export const Title = styled.div`
  margin-bottom: ${sizes(0.5)};
`

export const Content = styled.div`
  width: 100%;
`

type StyledListItemProps = {
  read?: boolean
  variant: Variant
  loading?: boolean
}

const getListItemStyles = ({ loading }: StyledListItemProps) => {
  if (loading) {
    return
  }
  return css`
    background-color: transparent;
    padding: ${sizes(4)};
  `
}

export const StyledListItem = styled(ListItem)<StyledListItemProps>`
  ${getReadNotificationVariant};
  ${getListItemStyles};

  position: relative;
  box-shadow: ${cVar('effectDividersTop')};
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`

export const IconWrapper = styled.div`
  position: relative;
  padding-right: ${sizes(2)};
`

export const IconContainer = styled.div<{ color: 'red' | 'blue' | 'green' | 'gray' }>`
  position: absolute;
  width: 24px;
  border-radius: 50%;
  height: 24px;
  bottom: 0;
  right: 0;
  box-shadow: 0 0 0 1px ${cVar('colorCoreNeutral700')};
  display: grid;
  place-items: center;

  ${(props) => {
    switch (props.color) {
      case 'blue':
        return css`
          background-color: ${cVar('colorBackgroundPrimaryStrong')};
        `
      case 'red':
        return css`
          background-color: ${cVar('colorBackgroundError')};
        `
      case 'green':
        return css`
          background-color: ${cVar('colorBackgroundSuccessStrong')};
        `
      case 'gray':
      default:
        return css`
          background-color: ${cVar('colorBorderStrong')};
        `
    }
  }}

  svg {
    width: 16px;
    height: 16px;
  }
`
