import { Placeholder, Text } from '@/shared/components'
import { breakpoints, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { fluidRange } from 'polished'
import Avatar from '../Avatar'
import Button from '../Button'

const SM_TITLE_HEIGHT = '44px'
const TITLE_HEIGHT = '51px'
const SM_SUBTITLE_HEIGHT = '24px'
const SUBTITLE_HEIGHT = '27px'

type CoverImageProps = {
  src: string
  editable?: boolean
}

type EditableOverlayProps = {
  withImage?: boolean
}

type TitleContainerProps = {
  editable?: boolean
}

export const Header = styled.section`
  position: relative;
`

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

const commonButtonStyles = css`
  border: none;
  background: none;
  font-size: ${typography.sizes.subtitle2};
  cursor: pointer;
  position: absolute;
`

export const EditableOverlay = styled.div<EditableOverlayProps>`
  z-index: 1;
  width: 100%;
  position: absolute;
  display: flex;
  height: 100%;
  justify-content: center;
  top: 0;
  :hover button {
    opacity: 1;
  }
`

export const RemoveCoverButton = styled.button`
  ${commonButtonStyles};
  opacity: 1;
  transition: opacity ${transitions.timings.loading} ${transitions.easing};
  position: absolute;
  display: flex;
  align-items: center;
  color: ${colors.white};
  right: ${sizes(5)};
  top: ${sizes(4)};
  span {
    margin-left: 10px;
  }
  svg {
    width: 16px;
    fill: ${colors.white};
  }
  @media screen and (min-width: ${breakpoints.small}) {
    opacity: 0;
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    right: ${sizes(10)};
    top: ${sizes(9)};
  }
`

export const EditCoverButton = styled.button`
  ${commonButtonStyles};
  transition: opacity ${transitions.timings.loading} ${transitions.easing};
  color: ${colors.white};
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-end;
  opacity: 1;
  justify-content: center;
  padding-bottom: 30px;

  svg {
    padding: 10px;
    margin-right: 12px;
    border-radius: 100%;
    width: 40px;
    border: 1px solid ${colors.white};
    fill: ${colors.white};
  }
  span {
    text-align: left;
    line-height: 40px;
    width: 160px;
    .large-viewports {
      display: none;
    }
  }
  @media screen and (min-width: ${breakpoints.small}) {
    color: ${colors.gray[200]};
    opacity: 0;
    padding-bottom: 50px;
    span {
      line-height: 20px;
      .large-viewports {
        display: inline;
      }
    }
    svg {
      fill: ${colors.gray[200]};
      border: 1px solid ${colors.gray[200]};
    }
  }
`

export const TitleSection = styled.div`
  position: absolute;
  margin-top: 40px;
  top: 0;
  width: 100%;
  @media (min-width: ${breakpoints.small}) {
    display: flex;
    align-items: center;
  }
`

export const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${sizes(5)};
`

export const StyledAvatar = styled(Avatar)`
  margin: 0 ${sizes(6)} 0 0;
  margin-bottom: ${sizes(3)};
  z-index: 2;

  @media (min-width: ${breakpoints.small}) {
    margin: 0 ${sizes(6)} 0 0;
  }
`

export const TitleContainer = styled.div<TitleContainerProps>`
  z-index: 2;
  max-width: 100%;
  ${({ editable }) => !editable && `overflow: hidden`};
`

export const Title = styled(Text)`
  line-height: 1;
  padding: ${sizes(1)} ${sizes(2)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })};
  background-color: ${colors.gray[800]};
  text-overflow: ellipsis;
  max-height: 250px;
  overflow: hidden;
  @media (min-width: ${breakpoints.small}) {
    word-break: break-all;
  }
`

export const SubTitle = styled(Text)`
  padding: ${sizes(1)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '14px', toSize: '18px' })};
  margin-top: ${sizes(2)};
  color: ${colors.white};
  background-color: ${colors.gray[800]};
  display: inline-block;
`

export const TitlePlaceholder = styled(Placeholder)`
  width: 300px;
  height: ${SM_TITLE_HEIGHT};
  @media screen and (min-width: ${breakpoints.medium}) {
    height: ${TITLE_HEIGHT};
  }
`

export const SubTitlePlaceholder = styled(Placeholder)`
  width: 140px;
  margin-top: ${sizes(2)};
  height: ${SM_SUBTITLE_HEIGHT};
  @media screen and (min-width: ${breakpoints.medium}) {
    height: ${SUBTITLE_HEIGHT};
  }
`
export const StyledButton = styled(Button)`
  position: relative;
  z-index: 3;
  margin-top: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    margin-top: 0;
    margin-left: auto;
  }
`
