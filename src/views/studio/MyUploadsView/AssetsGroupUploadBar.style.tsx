import styled from '@emotion/styled'
import { colors, sizes, zIndex, breakpoints } from '@/shared/theme'

export const AssetsGroupBarUploadContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: ${sizes(6)};
  padding: ${sizes(4)};
  width: 100%;
  height: ${sizes(20)};
`
export const ProgressBar = styled.div`
  --progress-bar-color: #b4bbff33;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--progress-bar-color);
`

export const Thumbnail = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  width: ${sizes(18)};
  height: ${sizes(12)};
  background-color: ${colors.gray[700]};
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
