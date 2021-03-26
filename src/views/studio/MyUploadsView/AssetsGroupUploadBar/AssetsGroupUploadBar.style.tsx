import styled from '@emotion/styled'
import { colors, sizes, zIndex, breakpoints, transitions } from '@/shared/theme'

type ProgressbarProps = {
  progress: number
}

type DrawerProps = {
  isActive?: boolean
}

export const Container = styled.div`
  position: relative;
  background-color: ${colors.black};
  padding-bottom: ${sizes(6)};
`

export const AssetsGroupBarUploadContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${sizes(4)};
  width: 100%;
  height: ${sizes(20)};
  background-color: ${colors.black};
  z-index: ${zIndex.overlay};
  transition: all ${transitions.timings.regular} ${transitions.easing};
`
export const ProgressBar = styled.div<ProgressbarProps>`
  --progress-bar-color: #b4bbff33;
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ progress }) => progress && `${progress}%`};
  height: 100%;
  background-color: var(--progress-bar-color);
  transition: width 1s linear;
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
    width: 24px;
    height: 24px;
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
`

export const UploadInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  width: fit-content;
  height: ${sizes(12)};
  color: ${colors.gray[300]};
  text-align: right;
  button {
    margin-left: ${sizes(4)};
    z-index: ${zIndex.overlay};
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
  height: ${({ isActive }) => (isActive ? 'auto' : 0)};
  padding: ${sizes(6)} ${sizes(2)};
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transform: translateY(${({ isActive }) => (isActive ? 0 : '-100%')});
  background-color: ${colors.gray[800]};
  overflow: hidden;
  transition: all ${transitions.timings.sharp} ${transitions.easing};
  @media screen and (min-width: ${breakpoints.small}) {
    padding: ${sizes(6)} ${sizes(4)};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    padding: ${sizes(2)} ${sizes(6)} ${sizes(2)} ${sizes(13)};
  }
`
