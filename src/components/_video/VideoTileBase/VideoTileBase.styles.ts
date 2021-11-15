import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { IconButton } from '@/components/_buttons/IconButton'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { colors, sizes, square, typography } from '@/theme'

type SizeProps = {
  size?: 'small' | 'big'
}

type ChannelProps = {
  channelClickable: boolean
}

type ClickableProps = {
  clickable: boolean
}

type LoadingProps = {
  isLoading?: boolean
}

type ActiveProps = {
  isActive?: boolean
}

export const Anchor = styled(Link)`
  all: unset;
  color: inherit;
`

export const TitleHeaderAnchor = styled(Link)`
  margin-bottom: ${sizes(2)};
  text-decoration: none;
  display: block;
`

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${sizes(3)};
`

export const AvatarContainer = styled.div`
  ${square(40)};

  margin-right: ${sizes(3)};
`

export const TextContainer = styled.div`
  flex: 1;
  overflow: hidden;
`

export const KebabMenuButtonIcon = styled(IconButton)<ActiveProps>`
  ${square(32)};

  opacity: 0;
  margin-left: ${sizes(2)};
  pointer-events: ${({ isActive }) => (isActive ? 'auto' : 'none')};

  @media (any-pointer: coarse) {
    opacity: 1;
  }
`

const containerHoverStyles = ({ isLoading }: LoadingProps) =>
  !isLoading
    ? css`
        :hover {
          ${KebabMenuButtonIcon} {
            opacity: 1;
            pointer-events: auto;
          }
        }
      `
    : null

export const Container = styled.article<LoadingProps>`
  width: 100%;
  display: inline-flex;
  flex-direction: column;

  ${containerHoverStyles};
`

type MetaContainerProps = { noMarginTop: boolean }
export const MetaContainer = styled.div<MetaContainerProps>`
  width: 100%;
`

export const ProgressOverlay = styled.div`
  position: relative;
  height: ${sizes(1)};
  margin-top: ${sizes(3)};
  background-color: ${colors.gray[400]};
`

export const ProgressBar = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 100%;
  max-width: 100%;
  width: 0;
  background-color: ${colors.gray[50]};
`

export const StyledAvatar = styled(Avatar)<ChannelProps>`
  ${square('100%')}

  cursor: ${({ channelClickable }) => (channelClickable ? 'pointer' : 'auto')};
`

export const TitleHeader = styled(Text)<ClickableProps & SizeProps>`
  font-size: ${({ size }) => (size === 'small' ? typography.sizes.h6 : typography.sizes.subtitle1)};
  line-height: ${({ size }) => (size === 'small' ? typography.lineHeights.h6 : typography.lineHeights.subtitle1)};
  cursor: ${(props) => (props.clickable ? 'pointer' : 'auto')};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
`

export const ChannelHandle = styled(Text)<ChannelProps>`
  display: inline-block;
  cursor: ${({ channelClickable }) => (channelClickable ? 'pointer' : 'auto')};
`

export const SpacedSkeletonLoader = styled(SkeletonLoader)`
  margin-top: 6px;
`
