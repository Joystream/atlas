import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { colors, sizes, square, transitions, typography, zIndex } from '@/shared/theme'

import { Avatar } from '../Avatar'
import { IconButton } from '../IconButton'
import { SkeletonLoader } from '../SkeletonLoader'
import { Text } from '../Text'

export const HOVER_BORDER_SIZE = '2px'

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

export const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
`

const clickableAnimation = (clickable: boolean) =>
  clickable
    ? css`
        transform: translate(-${sizes(2)}, -${sizes(2)});
        box-shadow: ${sizes(2)} ${sizes(2)} 0 ${colors.blue['500']};

        ${CoverHoverOverlay} {
          opacity: 1;
        }
        ${CoverIconWrapper} {
          opacity: 1;
        }

        ::after {
          transform: translate(${sizes(2)}, ${sizes(2)});
        }
      `
    : css`
        ${CoverHoverOverlay} {
          opacity: 1;
          border-color: ${colors.white};
        }

        ${CoverIconWrapper} {
          opacity: 1;
        }
      `
export const CoverContainer = styled.div<ClickableProps>`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  transition: all ${transitions.timings.regular} ${transitions.easing};
  cursor: ${(props) => (props.clickable ? 'pointer' : 'auto')};

  :active {
    ${() => clickableAnimation(false)}
  }

  :hover:not(:active) {
    ${(props) => clickableAnimation(props.clickable)}
  }

  ::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`

export const Anchor = styled(Link)`
  all: unset;
  color: inherit;
`

export const DELAYED_FADE_CLASSNAME = 'delayed-fade'

export const UploadProgressTransition = styled.div`
  &.${DELAYED_FADE_CLASSNAME}-enter {
    opacity: 0;
  }

  &.${DELAYED_FADE_CLASSNAME}-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-out;
  }

  &.${DELAYED_FADE_CLASSNAME}-exit {
    opacity: 1;
  }

  &.${DELAYED_FADE_CLASSNAME}-exit-active {
    opacity: 0;
    transition: opacity 400ms ease-out 600ms;
  }
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

  margin-left: ${sizes(2)};
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  pointer-events: ${({ isActive }) => (isActive ? 'auto' : 'none')};
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

export const CoverImageContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

type CoverImageProps = {
  darkenImg: boolean
}
export const CoverImage = styled.img<CoverImageProps>`
  ${square('100%')}

  display: block;
  ${({ darkenImg }) => darkenImg && `filter: brightness(45%);`}
`

export const CoverNoImage = styled.div`
  ${square('100%')}

  background: linear-gradient(125deg, rgba(16, 18, 20, 1) 30%, rgba(34, 36, 38, 1) 65%, rgba(16, 18, 20, 1) 100%);
`

export const CoverThumbnailUploadFailed = styled.div`
  ${square('100%')}

  background: linear-gradient(125deg, rgba(16, 18, 20, 1) 30%, rgba(34, 36, 38, 1) 65%, rgba(16, 18, 20, 1) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const SkeletonHoverOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${zIndex.overlay};
`

export const CoverHoverOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  transition: opacity ${transitions.timings.regular} ${transitions.easing}, border ${transitions.timings.routing} linear;
  background-color: ${colors.transparentGray[54]};
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${HOVER_BORDER_SIZE} solid transparent;
`

export const RemoveButton = styled(IconButton)`
  position: absolute;
  top: ${sizes(2)};
  right: ${sizes(2)};
`

export const CoverIconWrapper = styled.div`
  opacity: 0;
  transition: all ${transitions.timings.regular} ease-out;
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

export const CoverVideoPublishingStateOverlay = styled.div`
  position: absolute;
  bottom: ${sizes(2)};
  left: ${sizes(2)};
  padding: ${sizes(1)} ${sizes(2)};
  display: flex;
  align-items: center;
  background-color: ${colors.black};
  color: ${colors.white};
  z-index: ${zIndex.overlay};
`

export const PublishingStateText = styled(Text)`
  margin-left: ${sizes(1.5)};
`

export const CoverDurationOverlay = styled.div`
  position: absolute;
  bottom: ${sizes(2)};
  right: ${sizes(2)};
  padding: ${sizes(1.5)} ${sizes(2)};
  background-color: ${colors.black};
  color: ${colors.white};
  font-size: ${typography.sizes.body2};
  z-index: ${zIndex.overlay};
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
export const CoverSkeletonLoader = styled(SkeletonLoader)`
  ${square('100%')}

  position: absolute;
  top: 0;
  left: 0;
`

export const CoverTopLeftContainer = styled.div`
  position: absolute;
  top: ${sizes(2)};
  left: ${sizes(2)};
`
