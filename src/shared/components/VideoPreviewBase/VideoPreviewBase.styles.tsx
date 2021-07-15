import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { fluidRange } from 'polished'
import { Link } from 'react-router-dom'

import { colors, media, sizes, square, transitions, typography, zIndex } from '@/shared/theme'

import { Avatar } from '../Avatar'
import { IconButton } from '../IconButton'
import { Placeholder } from '../Placeholder'
import { Text } from '../Text'

export const HOVER_BORDER_SIZE = '2px'

type MainProps = {
  main: boolean
}

type ChannelProps = {
  channelClickable: boolean
}

type ClickableProps = {
  clickable: boolean
}

type ScalesWithCoverProps = {
  scalingFactor: number
}

export const CoverWrapper = styled.div<MainProps>`
  width: 100%;
  max-width: ${({ main }) => (main ? '650px' : '')};
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
`

const mainContainerCss = css`
  ${media.medium} {
    flex-direction: row;
  }
`

export const Anchor = styled(Link)`
  all: unset;
  color: inherit;
`

export const TitleHeaderAnchor = styled(Link)`
  all: unset;
  color: inherit;
  display: grid;
`

export const Container = styled.article<MainProps>`
  width: 100%;
  color: ${colors.gray[300]};
  display: inline-flex;
  flex-direction: column;
  ${({ main }) => main && mainContainerCss}

  :hover {
    ${() => css`
      ${KebabMenuIconContainer} {
        display: flex;
      }
    `}
  }
`

const mainInfoContainerCss = css`
  ${media.medium} {
    margin: ${sizes(8)} 0 0 ${sizes(6)};
  }
`

export const InfoContainer = styled.div<MainProps>`
  min-height: 86px;
  display: flex;
  margin-top: ${({ main }) => (main ? sizes(4) : sizes(3))};
  ${({ main }) => main && mainInfoContainerCss};
`

export const AvatarContainer = styled.div<ScalesWithCoverProps>`
  width: calc(40px * ${(props) => props.scalingFactor});
  min-width: calc(40px * ${(props) => props.scalingFactor});
  height: calc(40px * ${(props) => props.scalingFactor});
  margin-right: ${sizes(3)};
`

export const TextContainer = styled.div`
  width: calc(100% - 87px);
`

type MetaContainerProps = { noMarginTop: boolean } & MainProps
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

export const KebabMenuIconContainer = styled.div<{ isActive?: boolean }>`
  ${square(sizes(9))};

  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  border-radius: 100%;
  transition: all ${transitions.timings.regular} ${transitions.easing};
  margin-left: auto;

  path {
    transition: all ${transitions.timings.regular} ${transitions.easing};
  }

  &:hover {
    path:not([fill='none']) {
      fill: ${colors.white};
    }

    background-color: ${colors.transparentPrimary[18]};
  }
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

export const TitleHeader = styled(Text)<MainProps & ScalesWithCoverProps & ClickableProps>`
  margin: 0;
  margin-bottom: ${sizes(2)};
  font-weight: ${typography.weights.bold};
  font-size: calc(${(props) => props.scalingFactor} * ${typography.sizes.h6});
  ${({ main }) => main && fluidRange({ prop: 'fontSize', fromSize: '24px', toSize: '40px' })};

  line-height: ${({ main }) => (main ? 1 : 1.25)};
  cursor: ${(props) => (props.clickable ? 'pointer' : 'auto')};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
`

export const ChannelHandle = styled(Text)<ChannelProps & ScalesWithCoverProps>`
  font-size: calc(${(props) => props.scalingFactor} * ${typography.sizes.subtitle2});
  display: inline-block;
  cursor: ${({ channelClickable }) => (channelClickable ? 'pointer' : 'auto')};
`

export const MetaText = styled(Text)<MainProps & ScalesWithCoverProps>`
  font-size: ${({ main, scalingFactor }) =>
    main ? typography.sizes.h6 : `calc(${scalingFactor}*${typography.sizes.subtitle2}) `};
`

export const SpacedPlaceholder = styled(Placeholder)`
  margin-top: 6px;
`
export const CoverPlaceholder = styled(Placeholder)`
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
