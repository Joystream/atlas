import styled from '@emotion/styled'

import { media } from '@/styles'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding: 32px;
  min-height: 600px;
`

export const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: -1;
  ${media.md} {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
`

export const InformationContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  background: black;
  opacity: 0.4;
`
