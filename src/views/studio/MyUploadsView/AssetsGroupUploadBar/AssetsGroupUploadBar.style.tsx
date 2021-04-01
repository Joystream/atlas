import styled from '@emotion/styled'
import { colors, sizes, zIndex, breakpoints, transitions } from '@/shared/theme'

type ProgressbarProps = {
  progress: number
}

type AssetsGroupUploadBarProps = {
  isActive?: boolean
}

type DrawerProps = {
  maxHeight?: number
} & AssetsGroupUploadBarProps

export const Container = styled.div`
  position: relative;
  margin-bottom: ${sizes(6)};
`

export const AssetsGroupUploadBarContainer = styled.div<AssetsGroupUploadBarProps>`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${sizes(4)};
  width: 100%;
  height: ${sizes(20)};
  background-color: ${({ isActive }) => (isActive ? colors.gray[900] : colors.black)};
  cursor: pointer;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};
  &:hover {
    background-color: ${colors.gray[900]};
  }
`
export const ProgressBar = styled.div<ProgressbarProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${colors.transparentPrimary[20]};
  transform-origin: 0 0;
  transform: scaleX(${({ progress }) => progress && `${progress / 100}`});
  transition: transform 1s linear;
  animation: load 2.5s infinite ease-in-out;
  @keyframes load {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }
`

export const Thumbnail = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  width: ${sizes(18)};
  height: ${sizes(12)};
  background-color: ${colors.gray[700]};
  svg {
    width: ${sizes(6)};
    height: ${sizes(6)};
  }
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
  }
`
export const AssetsInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: ${sizes(4)};
  height: ${sizes(12)};
  color: ${colors.gray[300]};
  z-index: ${zIndex.overlay};
`

export const UploadInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  width: fit-content;
  height: ${sizes(12)};
  color: ${colors.gray[300]};
  text-align: right;
  z-index: ${zIndex.overlay};
  button {
    margin-left: ${sizes(4)};
    svg {
      width: auto;
      height: auto;
    }
  }
`

export const AssetsDrawerContainer = styled.div<DrawerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  top: 0;
  width: 100%;
  max-height: ${({ isActive, maxHeight }) => (isActive ? `${maxHeight}px` : '0px')};
  background-color: ${colors.gray[800]};
  overflow: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
`
