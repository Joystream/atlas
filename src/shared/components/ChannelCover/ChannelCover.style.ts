import { breakpoints, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

type CoverImageProps = {
  src: string
  editable?: boolean
}

type EditableOverlayProps = {
  withImage?: boolean
}

export const MediaWrapper = styled.div`
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  height: 280px;
  width: calc(100% + calc(2 * var(--global-horizontal-padding)));
  position: relative;
`

export const Media = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  z-index: ${zIndex.background};
`

export const CoverImage = styled.div<CoverImageProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-repeat: no-repeat;
  background-position: center;
  background-attachment: local;
  background-size: cover;

  background-image: linear-gradient(0deg, black 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0) 100%),
    url(${({ src }) => src});
  transition: opacity ${transitions.timings.loading} ${transitions.easing};
  opacity: ${({ editable }) => (editable ? 0.6 : 1)};
`

export const EditableOverlay = styled.div<EditableOverlayProps>`
  z-index: 1;
  width: 100%;
  position: absolute;
  height: 100%;
  top: 0;
  :hover button {
    opacity: 1;
  }
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
    justify-content: center;
  }
`

const commonButtonStyles = css`
  border: none;
  background: ${colors.gray[800]};
  font-size: ${typography.sizes.subtitle2};
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  color: ${colors.white};
  padding: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    background: none;
  }
`

export const RemoveCoverButton = styled.button`
  ${commonButtonStyles};
  bottom: 0;
  right: ${sizes(5)};
  opacity: 1;
  transition: opacity ${transitions.timings.loading} ${transitions.easing};
  span {
    margin-left: ${sizes(2)};
  }
  svg {
    width: ${sizes(5)};
    fill: ${colors.white};
  }

  @media screen and (min-width: ${breakpoints.small}) {
    top: ${sizes(4)};
    bottom: initial;
    opacity: 0;
    span {
      margin-left: 10px;
    }
    svg {
      width: ${sizes(4)};
      fill: ${colors.white};
    }
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    right: ${sizes(10)};
    top: ${sizes(9)};
  }
`

export const EditCoverButton = styled.button`
  ${commonButtonStyles};
  bottom: 0px;
  left: ${sizes(5)};
  transition: opacity ${transitions.timings.loading} ${transitions.easing};

  svg {
    width: ${sizes(5)};
    margin-right: ${sizes(2)};
    fill: ${colors.white};
  }
  span {
    text-align: left;
    line-height: ${sizes(5)};
    .large-viewports {
      display: none;
    }
  }
  @media screen and (min-width: ${breakpoints.small}) {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: flex-end;
    opacity: 1;
    justify-content: center;
    padding-bottom: 30px;
    color: ${colors.gray[200]};
    opacity: 0;
    padding-bottom: 50px;
    span {
      width: 160px;
      line-height: ${sizes(5)};
      .large-viewports {
        display: inline;
      }
    }
    svg {
      width: 40px;
      padding: 10px;
      margin-right: 12px;
      fill: ${colors.gray[200]};
      border-radius: 100%;
      border: 1px solid ${colors.gray[200]};
    }
  }
`
