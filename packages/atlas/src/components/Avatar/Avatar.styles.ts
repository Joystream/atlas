import isPropValid from '@emotion/is-prop-valid'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionAddImage, SvgActionEdit, SvgIllustrativeFileFailed } from '@/assets/icons'
import { SvgAvatarSilhouette } from '@/assets/illustrations'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, square, zIndex } from '@/styles'

export type AvatarSize = 136 | 104 | 88 | 40 | 32 | 24

type ContainerProps = {
  size: AvatarSize
  isLoading?: boolean
  isClickable: boolean
  disableInteractiveStyles?: boolean
  // allow passing 'type' prop to Container because it can be rendered as 'button' depending on context
  type?: 'button'
  disableHoverDimm?: boolean
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

// const coverAvatarCss = css`
//   ${square('64px')};

//   ${media.md} {
//     ${square('88px')};
//   }
// `

// const channelAvatarCss = css`
//   ${square('88px')};
//   ${media.md} {
//     ${square('136px')};
//   }
// `
// const channelCardAvatarCss = css`
//   ${square('88px')};
//   ${media.md} {
//     ${square('104px')};
//   }
// `

export const sharedAvatarHoverStyles = (props: { disableHoverDimm?: boolean }) => css`
  ::after {
    border: 1px solid ${cVar('colorBackgroundAlpha')};
  }
  ${IconAndOverlayWrapper} {
    opacity: 1;
  }
  ${Overlay} {
    ${props.disableHoverDimm ? '' : 'opacity: 0.5;'}

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
  ${({ size }) => square(`${size}px`)};
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
