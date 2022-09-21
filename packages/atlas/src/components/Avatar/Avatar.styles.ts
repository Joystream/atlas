import isPropValid from '@emotion/is-prop-valid'
import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionAddImage, SvgActionEdit, SvgIllustrativeFileFailed } from '@/components/_icons'
import { SvgAvatarSilhouette } from '@/components/_illustrations'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, square, zIndex } from '@/styles'

export type AvatarSize =
  | 'preview'
  | 'cover'
  | 'default'
  | 'fill'
  | 'bid'
  | 'small'
  | 'channel'
  | 'channel-card'
  | 'extra-small'

type ContainerProps = {
  size: AvatarSize
  isLoading?: boolean
  isClickable: boolean
  disableInteractiveStyles?: boolean
  // allow passing 'type' prop to Container because it can be rendered as 'button' depending on context
  type?: 'button'
}

export const IconAndOverlayWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const StyledSvgActionEdit = styled(SvgActionEdit)`
  position: relative;
`
export const StyledSvgActionAddImage = styled(SvgActionAddImage)`
  position: relative;
`

export const Overlay = styled.div<{ isEdit?: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 100%;
  transition: background-color ${cVar('animationTransitionMedium')};
  opacity: 0;

  ${({ isEdit }) =>
    isEdit &&
    css`
      background-color: ${cVar('colorBackgroundOverlay')};
      opacity: 0.5;
    `};
`

const previewAvatarCss = css`
  ${square('136px')};
`

const coverAvatarCss = css`
  ${square('64px')};

  ${media.md} {
    ${square('88px')};
  }
`

const channelAvatarCss = css`
  ${square('88px')};
  ${media.md} {
    ${square('136px')};
  }
`
const channelCardAvatarCss = css`
  ${square('88px')};
  ${media.md} {
    ${square('104px')};
  }
`

const bidAvatarCss = css`
  ${square('24px')};
`

const smallAvatarCss = css`
  ${square('40px')};
`

const defaultAvatarCss = css`
  ${square('32px')};
`

const fillAvatarCss = css`
  width: 100%;
  height: 100%;
`

const extraSmallAvatarCss = css`
  ${square('16px')};
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
    case 'extra-small':
      return extraSmallAvatarCss
    default:
      return defaultAvatarCss
  }
}

export const sharedAvatarHoverStyles = css`
  ::after {
    border: 1px solid ${cVar('colorBackgroundAlpha')};
  }
  ${IconAndOverlayWrapper} {
    opacity: 1;
  }
  ${Overlay} {
    opacity: 0.5;
    background-color: ${cVar('colorBackgroundOverlay')};
  }
`

export const sharedAvatarActiveStyles = css`
  ::after {
    border: 1px solid ${cVar('colorBackgroundMutedAlpha')};
  }
  ${IconAndOverlayWrapper} {
    opacity: 1;
  }
  ${Overlay} {
    opacity: 1;
    background-color: ${cVar('colorBackgroundOverlay')};
  }
`

const getInteractiveStyles = ({ isLoading, isClickable }: Omit<ContainerProps, 'size'>) => {
  if (isLoading || !isClickable) {
    return css`
      pointer-events: none;
    `
  }
}

export const Container = styled('div', { shouldForwardProp: isPropValid })<ContainerProps>`
  ${getAvatarSizeCss};
  ${getInteractiveStyles};

  border-radius: 100%;
  overflow: hidden;
  padding: 0;
  border: 0;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;

  ::after {
    ${square('100%')};

    content: '';
    display: block;
    border-radius: 50%;
    z-index: ${zIndex.overlay};
    pointer-events: none;
    border: 1px solid ${cVar('colorBackgroundMutedAlpha')};
  }

  :hover {
    ${sharedAvatarHoverStyles};
  }

  :active {
    ${sharedAvatarActiveStyles};
  }
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
  flex-direction: column;
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
    fill: ${cVar('colorCoreNeutral100')};
  }
`
