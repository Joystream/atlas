import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/core'
import { breakpoints, colors, sizes } from '@/shared/theme'
import { CoverHoverOverlay, CoverIcon, ProgressOverlay } from './VideoPreview.styles'

export const HOVER_BORDER_SIZE = '2px'

type MainProps = {
  main: boolean
}

type ClickableProps = {
  clickable: boolean
}

type ScalesWithCoverProps = {
  scalingFactor: number
}

const fadeIn = keyframes`
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }
`

export const fadeInAnimation = css`
  animation: ${fadeIn} 0.5s ease-in;
`

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
  transition-property: box-shadow, transform;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  ${fadeInAnimation};
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

export const MetaContainer = styled.div<MainProps>`
  margin-top: ${({ main }) => (main ? sizes(3) : sizes(2))};
  width: 100%;
`
