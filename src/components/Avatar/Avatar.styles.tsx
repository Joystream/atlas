import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'
import { TransitionGroup } from 'react-transition-group'

import { SkeletonLoader } from '@/components/SkeletonLoader'
import { SvgAvatarSilhouette } from '@/components/_illustrations'
import { colors, media, transitions, typography } from '@/theme'

export type AvatarSize = 'preview' | 'cover' | 'view' | 'default' | 'fill' | 'small' | 'channel' | 'channel-card'

type ContainerProps = {
  size: AvatarSize
}

type EditButtonProps = {
  size: Omit<AvatarSize, 'default'>
}

const previewAvatarCss = css`
  width: 156px;
  min-width: 156px;
  height: 156px;
`

const coverAvatarCss = css`
  width: 64px;
  min-width: 64px;
  height: 64px;

  ${media.md} {
    width: 88px;
    min-width: 88px;
    height: 88px;
  }
`

const channelAvatarCss = css`
  width: 88px;
  min-width: 88px;
  height: 88px;
  ${media.md} {
    width: 136px;
    min-width: 136px;
    height: 136px;
  }
`
const channelCardAvatarCss = css`
  width: 88px;
  min-width: 88px;
  height: 88px;
  ${media.md} {
    width: 104px;
    min-width: 104px;
    height: 104px;
  }
`

const viewAvatarCss = css`
  width: 128px;
  min-width: 128px;
  height: 128px;
  ${media.md} {
    width: 136px;
    min-width: 136px;
    height: 136px;
  }
`

const smallAvatarCss = css`
  width: 40px;
  min-width: 40px;
  height: 40px;
`

const defaultAvatarCss = css`
  width: 32px;
  min-width: 32px;
  height: 32px;
`

const fillAvatarCss = css`
  width: 100%;
  height: 100%;
`

const getAvatarSizeCss = (size: AvatarSize): SerializedStyles => {
  switch (size) {
    case 'preview':
      return previewAvatarCss
    case 'cover':
      return coverAvatarCss
    case 'view':
      return viewAvatarCss
    case 'channel':
      return channelAvatarCss
    case 'channel-card':
      return channelCardAvatarCss
    case 'fill':
      return fillAvatarCss
    case 'small':
      return smallAvatarCss
    default:
      return defaultAvatarCss
  }
}

export const Container = styled.div<ContainerProps>`
  ${({ size }) => getAvatarSizeCss(size)};

  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

export const EditButton = styled.button<EditButtonProps>`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  cursor: pointer;
  background: none;
  border: none;
  position: absolute;
  z-index: 3;
  color: ${colors.gray[100]};
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  font-size: ${typography.sizes.subtitle2};
  ${({ size }) => size === 'cover' && `font-size: ${typography.sizes.button.small}`};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background-color ${transitions.timings.loading} ${transitions.easing};
  opacity: 0;

  :hover {
    background-color: ${colors.transparentBlack[54]};
    opacity: 1;
  }

  :active {
    border: 2px solid ${colors.blue[500]};
  }

  span {
    ${({ size }) => size === 'small' && 'display: none'};
  }
`

export const StyledSkeletonLoader = styled(SkeletonLoader)`
  position: absolute;
  left: 0;
`

export const StyledTransitionGroup = styled(TransitionGroup)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledImage = styled.img`
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 100%;
`
export const SilhouetteAvatar = styled(SvgAvatarSilhouette)`
  position: absolute;
  width: 100%;
  height: 100%;
`

export const NewChannelAvatar = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-color: ${colors.gray[800]};
`
