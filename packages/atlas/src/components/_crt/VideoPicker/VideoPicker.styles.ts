import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const MainWrapper = styled.div`
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
  aspect-ratio: 16/9;
  width: 100%;

  ${media.sm} {
    padding-top: 0;
  }
`

export const PlaceholderBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: ${sizes(6)};
  align-items: center;
  justify-content: center;
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(4)};
  top: 0;
  width: 100%;
  height: 100%;

  ${media.sm} {
    padding: ${sizes(6)};
  }
`

export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(2)};
  align-items: center;
  justify-content: center;
  max-width: 300px;
  text-align: center;
`

export const DialogContent = styled.div`
  display: grid;
  padding: ${sizes(6)};
`

export const VideoBox = styled.div`
  margin-bottom: ${sizes(6)};
`

export const ThumbnailContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`

export const ThumbnailOverlay = styled.div`
  display: grid;
  place-items: center;
  align-content: center;
  gap: ${sizes(2)};
  position: absolute;
  inset: 0;
  background-color: #101214bf;
  opacity: 0;
  cursor: pointer;
  transition: all ${cVar('animationTransitionFast')};

  :hover {
    opacity: 1;
  }
`

export const RowBox = styled.div<{ gap: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${(props) => sizes(props.gap)};
`
