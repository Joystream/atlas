import styled from '@emotion/styled'
import { css, SerializedStyles } from '@emotion/react'
import { TransitionGroup } from 'react-transition-group'
import { breakpoints, colors, sizes, transitions, typography } from '@/shared/theme'
import Placeholder from '../Placeholder'
import { ReactComponent as Silhouette } from '@/assets/avatar-silhouette.svg'

export type AvatarSize = 'preview' | 'cover' | 'view' | 'default' | 'fill'

type ContainerProps = {
  size: AvatarSize
}

type EditButtonProps = {
  size: Omit<AvatarSize, 'default'>
  withAvatar?: boolean
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
  @media screen and (min-width: ${breakpoints.medium}) {
    width: 88px;
    min-width: 88px;
    height: 88px;
  }
`

const viewAvatarCss = css`
  width: 128px;
  min-width: 128px;
  height: 128px;
  @media (min-width: ${breakpoints.medium}) {
    width: 136px;
    min-width: 136px;
    height: 136px;
  }
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
    case 'fill':
      return fillAvatarCss
    default:
      return defaultAvatarCss
  }
}

export const Container = styled.div<ContainerProps>`
  ${({ size }) => getAvatarSizeCss(size)}
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
  color: ${colors.gray[300]};
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  font-size: ${typography.sizes.subtitle2};
  ${({ size }) => size === 'cover' && `font-size: ${typography.sizes.button.small}`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all ${transitions.timings.loading} ${transitions.easing};
  opacity: ${({ withAvatar }) => (withAvatar ? 0 : 1)};
  :hover {
    background-color: rgba(11, 12, 15, 0.7);
    opacity: 1;
  }
  svg {
    fill: ${colors.gray[300]};
    width: 17px;
    margin-bottom: ${sizes(3)};
    ${({ size }) =>
      size === 'cover' &&
      css`
        width: 15px;
        margin-bottom: ${sizes(1)};
      `};
  }
`

export const StyledPlaceholder = styled(Placeholder)`
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
export const SilhouetteAvatar = styled(Silhouette)`
  position: absolute;
  width: 100%;
  height: 100%;
`
