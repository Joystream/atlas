import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgIllustrativeFileFailed } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, oldColors, oldTypography, sizes, square, transitions, zIndex } from '@/styles'

export const HOVER_BORDER_SIZE = '2px'

type ClickableProps = {
  clickable: boolean
}

export const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
`

const clickableAnimation = (clickable: boolean) =>
  clickable
    ? css`
        transform: translate(-${sizes(2)}, -${sizes(2)});
        box-shadow: ${sizes(2)} ${sizes(2)} 0 ${oldColors.blue['500']};

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
          border-color: ${oldColors.white};
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

  grid-gap: ${sizes(2)};
  background: ${oldColors.gray[900]};
  display: grid;
  justify-items: center;
  align-content: center;
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
type CoverHoverOverlayProps = {
  darker?: boolean
}
export const CoverHoverOverlay = styled.div<CoverHoverOverlayProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  transition: opacity ${transitions.timings.regular} ${transitions.easing}, border ${transitions.timings.routing} linear;
  background-color: ${({ darker }) => (darker ? oldColors.transparentBlack[54] : oldColors.transparentGray[54])};
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

export const CoverVideoPublishingStateOverlay = styled.div`
  position: absolute;
  bottom: ${sizes(2)};
  left: ${sizes(2)};
  padding: ${sizes(1)} ${sizes(2)};
  display: flex;
  align-items: center;
  background-color: ${oldColors.black};
  color: ${oldColors.white};
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
  background-color: ${oldColors.black};
  color: ${oldColors.white};
  font-size: ${oldTypography.sizes.body2};
  z-index: ${zIndex.overlay};
`

export const CoverSkeletonLoader = styled(SkeletonLoader)`
  ${square('100%')}

  position: absolute;
  top: 0;
  left: 0;
`

export const CoverTopRigthContainer = styled.div`
  position: absolute;
  top: ${sizes(2)};
  right: ${sizes(2)};
`

export const StyledSvgIllustrativeFileFailed = styled(SvgIllustrativeFileFailed)`
  path {
    fill: ${cVar('colorCoreNeutral300')};
  }
`
