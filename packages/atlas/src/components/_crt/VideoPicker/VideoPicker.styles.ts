import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const PlaceholderBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(6)};
  align-items: center;
  justify-content: center;
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(6)};
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
  position: relative;
  height: 400px;
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
  transition: opacity 250ms ease-in-out;

  :hover {
    opacity: 1;
  }
`
