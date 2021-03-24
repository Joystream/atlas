import styled from '@emotion/styled'
import { colors, sizes, zIndex, breakpoints, transitions } from '@/shared/theme'

type FileLineProps = {
  isLast?: boolean
}

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
  animation: load 5s infinite ease-in-out;
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
    width: 20px;
    height: 20px;
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
    z-index: ${zIndex.nearOverlay};
    svg {
      width: auto;
      height: auto;
    }
  }
`

export const AssetsDrawerContainer = styled.div<DrawerProps>`
  position: relative;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  flex-direction: column;
  padding: ${sizes(2)};
  padding-left: ${sizes(13)};
  width: 100%;
  background-color: ${colors.gray[800]};
  overflow: hidden;
`

export const FileLineContainer = styled.div<FileLineProps>`
  display: flex;
  align-items: center;
  height: ${sizes(12)};
  margin-bottom: ${({ isLast }) => !isLast && sizes(6)};
`

export const FileLinePoint = styled.div`
  width: 37px;
  height: 32px;
  border-left: 2px solid ${colors.gray[500]};
  &:after {
    content: '';
    position: absolute;
    border-top: 2px solid ${colors.gray[500]};
    width: 33px;
    height: 32px;
    transform: translateY(calc(50% - 1px));
  }
`

export const FileLineLastPoint = styled.div`
  width: 35px;
  height: 17px;
  border-left: 2px solid ${colors.gray[500]};
  border-bottom: 2px solid ${colors.gray[500]};
  transform: translateY(calc(-50% + 1px));
`

export const FileStatusContainer = styled.div`
  width: ${sizes(6)};
  height: ${sizes(6)};
  margin-left: ${sizes(4)};
`

export const FileInfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  width: 100%;
  max-width: 600px;
  margin-left: 22px;
  color: ${colors.gray[300]};
  p {
    display: flex;
    align-items: center;
  }
`

export const FileInfoType = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  color: ${colors.white};
  svg {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
`
