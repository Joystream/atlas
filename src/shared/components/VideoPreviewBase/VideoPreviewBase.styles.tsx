import React from 'react'
import { Link } from 'react-router-dom'
import { fluidRange, transparentize } from 'polished'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { breakpoints, colors, sizes, transitions, typography } from '@/shared/theme'
import Placeholder from '../Placeholder'
import Avatar from '../Avatar'
import Icon from '../Icon'
import Text from '../Text'
import IconButton from '../IconButton'

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
        ${CoverIcon} {
          transform: translateY(0);
        }
        ${ProgressOverlay} {
          bottom: ${HOVER_BORDER_SIZE};
        }
      `
    : null
export const CoverContainer = styled.div<ClickableProps>`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  transition: all ${transitions.timings.regular} ${transitions.easing};
  cursor: ${(props) => (props.clickable ? 'pointer' : 'auto')};
  :hover {
    ${(props) => clickableAnimation(props.clickable)}
  }
`

const mainContainerCss = css`
  @media screen and (min-width: ${breakpoints.medium}) {
    flex-direction: row;
  }
`

export const Anchor = styled(Link)`
  all: unset;
  color: inherit;
`

export const Container = styled.article<MainProps>`
  width: 100%;
  color: ${colors.gray[300]};

  display: inline-flex;
  flex-direction: column;
  ${({ main }) => main && mainContainerCss}
`

const mainInfoContainerCss = css`
  @media screen and (min-width: ${breakpoints.medium}) {
    margin: ${sizes(8)} 0 0 ${sizes(6)};
  }
`

export const InfoContainer = styled.div<MainProps>`
  min-height: 86px;
  width: 100%;
  display: flex;
  margin-top: ${({ main }) => (main ? sizes(4) : sizes(3))};
  ${({ main }) => main && mainInfoContainerCss};
`

export const AvatarContainer = styled.div<ScalesWithCoverProps>`
  width: calc(40px * ${(props) => props.scalingFactor});
  min-width: calc(40px * ${(props) => props.scalingFactor});
  height: calc(40px * ${(props) => props.scalingFactor});
  margin-right: ${sizes(2)};
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
`

type MetaContainerProps = { noMarginTop: boolean } & MainProps
export const MetaContainer = styled.div<MetaContainerProps>`
  margin-top: ${sizes(2)};
  margin-top: ${({ noMarginTop }) => noMarginTop && 0};
  margin-top: ${({ main }) => main && sizes(3)};
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
  display: block;
  width: 100%;
  height: 100%;
  ${({ darkenImg }) => darkenImg && `filter: brightness(45%);`}
`

export const CoverNoImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(125deg, rgba(16, 18, 20, 1) 30%, rgba(34, 36, 38, 1) 65%, rgba(16, 18, 20, 1) 100%);
`

export const CoverHoverOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;

  transition: opacity ${transitions.timings.regular} ${transitions.easing};

  border: ${HOVER_BORDER_SIZE} solid ${colors.white};
  background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%);

  display: flex;
  justify-content: center;
  align-items: center;
`

export const RemoveButton = styled(IconButton)`
  position: absolute;
  top: ${sizes(2)};
  right: ${sizes(2)};
`

export const CoverIcon = styled(Icon)`
  transform: translateY(40px);
  transition: all ${transitions.timings.regular} ${transitions.easing};
  color: ${colors.white};
`
export const CoverPlayIcon = ({ ...props }) => (
  <CoverIcon
    css={css`
      width: 54px;
      height: 54px;
    `}
    name="play-outline"
    {...props}
  />
)
export const CoverEditIcon = ({ ...props }) => (
  <CoverIcon
    css={css`
      width: 46px;
      height: 46px;
      padding-bottom: 6px;
      border-bottom: 3px solid ${colors.white};
    `}
    name="pencil"
    {...props}
  />
)
export const DraftIcon = ({ ...props }) => <Icon name="page" {...props} />
export const UnlistedIcon = ({ ...props }) => <Icon name="unlisted" {...props} />
export const KebabMenuIcon = ({ ...props }) => <Icon name="kebab-menu" {...props} />

export const CoverRemoveButton = ({ ...props }) => <RemoveButton {...props} icon="close" />

export const ProgressOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${sizes(1)};
  background-color: ${colors.white};
`

export const ProgressBar = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 100%;
  max-width: 100%;
  width: 0;
  background-color: ${colors.blue['500']};
`

export const CoverVideoPublishingStateOverlay = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: absolute;
  bottom: ${sizes(2)};
  left: ${sizes(2)};
  padding: ${sizes(1)} ${sizes(2)};
  background-color: ${transparentize(0.1, colors.black)};
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.body2};
  text-transform: capitalize;
`

export const CoverDurationOverlay = styled.div`
  position: absolute;
  bottom: ${sizes(2)};
  right: ${sizes(2)};
  padding: ${sizes(1)} ${sizes(2)};
  background-color: ${colors.black};
  color: ${colors.white};
  font-size: ${typography.sizes.body2};
`

export const StyledAvatar = styled(Avatar)<ChannelProps>`
  width: 100%;
  height: 100%;
  cursor: ${({ channelClickable }) => (channelClickable ? 'pointer' : 'auto')};
`

export const TitleHeader = styled(Text)<MainProps & ScalesWithCoverProps & ClickableProps>`
  margin: 0;
  font-weight: ${typography.weights.bold};
  font-size: calc(${(props) => props.scalingFactor} * ${typography.sizes.h6});
  ${({ main }) => main && fluidRange({ prop: 'fontSize', fromSize: '24px', toSize: '40px' })};
  line-height: ${({ main }) => (main ? 1 : 1.25)};
  cursor: ${(props) => (props.clickable ? 'pointer' : 'auto')};
`

export const ChannelHandle = styled(Text)<ChannelProps & ScalesWithCoverProps>`
  font-size: calc(${(props) => props.scalingFactor} * ${typography.sizes.subtitle2});
  display: inline-block;
  cursor: ${({ channelClickable }) => (channelClickable ? 'pointer' : 'auto')};
`

export const MetaText = styled(Text)<MainProps & ScalesWithCoverProps>`
  font-size: ${({ main, scalingFactor }) =>
    main ? typography.sizes.h6 : `calc(${scalingFactor}*${typography.sizes.subtitle2})`};
`

export const SpacedPlaceholder = styled(Placeholder)`
  margin-top: 6px;
`
export const CoverPlaceholder = styled(Placeholder)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const CoverTopLeftContainer = styled.div`
  position: absolute;
  top: ${sizes(2)};
  left: ${sizes(2)};
`

export const KebabMenuIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: relative;
  border-radius: 100%;
  transition: all ${transitions.timings.regular} ${transitions.easing};

  path {
    transition: all ${transitions.timings.regular} ${transitions.easing};
  }

  &:hover {
    path:not([fill='none']) {
      fill: ${colors.white};
    }
    background-color: ${transparentize(1 - 0.06, colors.white)};
  }
`

export const ContextMenuContainer = styled.div``
