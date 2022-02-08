import isPropValid from '@emotion/is-prop-valid'
import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgIllustrativeFileFailed } from '@/components/_icons'
import { SvgAvatarSilhouette } from '@/components/_illustrations'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, square, zIndex } from '@/styles'

export type AvatarSize = 'preview' | 'cover' | 'default' | 'fill' | 'bid' | 'small' | 'channel' | 'channel-card'

type ContainerProps = {
  size: AvatarSize
  isLoading?: boolean
  isClickable: boolean
  withoutOutline?: boolean
  // allow passing 'type' prop to Container because it can be rendered as 'button' depending on context
  type?: 'button'
}

type EditOverlayProps = {
  size: Omit<AvatarSize, 'default'>
}

const previewAvatarCss = css`
  width: 136px;
  min-width: 136px;
  height: 136px;
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

const bidAvatarCss = css`
  width: 24px;
  min-width: 24px;
  height: 24px;
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

const getAvatarSizeCss = ({ size }: ContainerProps): SerializedStyles => {
  switch (size) {
    case 'preview':
      return previewAvatarCss
    case 'cover':
      return coverAvatarCss
    case 'channel':
      return channelAvatarCss
    case 'channel-card':
      return channelCardAvatarCss
    case 'fill':
      return fillAvatarCss
    case 'bid':
      return bidAvatarCss
    case 'small':
      return smallAvatarCss
    default:
      return defaultAvatarCss
  }
}

export const sharedAvatarHoverStyles = css`
  ::after {
    box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral200')};
  }
`
export const sharedAvatarActiveStyles = css`
  ::after {
    box-shadow: inset 0 0 0 2px ${cVar('colorCoreBlue500')};
  }
`

const getBorderStyles = ({ isLoading, isClickable, withoutOutline }: Omit<ContainerProps, 'size'>) => {
  if (withoutOutline || isLoading) {
    return
  }

  return css`
    ::after {
      ${square('100%')};

      content: '';
      display: block;
      border-radius: 50%;
      z-index: ${zIndex.overlay};
      pointer-events: none;
      box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
    }

    :hover {
      ${isClickable && sharedAvatarHoverStyles};
    }

    :active {
      ${isClickable && sharedAvatarActiveStyles};
    }
  `
}

export const EditOverlay = styled.div<EditOverlayProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 100%;
  z-index: 3;
  color: ${cVar('colorCoreNeutral100')};
  font: ${cVar('typographyDesktopT200Strong')};
  letter-spacing: ${cVar('typographyDesktopT200StrongLetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200StrongTextTransform')};

  ${({ size }) => size === 'cover' && `font-size: var(--typography-font-sizes-1)`};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background-color ${cVar('animationTransitionMedium')};
  opacity: 0;

  :hover {
    background-color: ${cVar('colorCoreNeutral500Darken')};
    opacity: 1;
  }

  span {
    ${({ size }) => size === 'small' && 'display: none'};
  }
`

export const Container = styled('div', { shouldForwardProp: isPropValid })<ContainerProps>`
  ${getAvatarSizeCss};
  ${getBorderStyles};

  border-radius: 100%;
  padding: 0;
  border: 0;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'inherit')};
`

export const StyledSkeletonLoader = styled(SkeletonLoader)`
  position: absolute;
  left: 0;
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
  background-color: ${cVar('colorCoreNeutral800')};
`

export const ChildrenWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  border-radius: 100%;
  ${square('100%')};
`
export const StyledSvgIllustrativeFileFailed = styled(SvgIllustrativeFileFailed)`
  path {
    fill: ${cVar('colorCoreNeutral300')};
  }
`
