import styled from '@emotion/styled'
import { css, SerializedStyles } from '@emotion/core'
import { TransitionGroup } from 'react-transition-group'
import { breakpoints, colors } from '../../theme'
import Placeholder from '../Placeholder'

export type AvatarSize = 'preview' | 'cover' | 'view' | 'default' | 'fill'

type ContainerProps = {
  size: AvatarSize
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
  background-color: ${colors.gray[400]};
  color: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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
  span {
    text-transform: uppercase;
    font-size: 0.875rem;
    line-height: 1.43;
  }
`

export const StyledImage = styled.img`
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 100%;
`
