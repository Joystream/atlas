import styled from '@emotion/styled'

import { cVar, media, sizes, zIndex } from '@/styles'

export const IllustrationWrapper = styled.div`
  margin: calc(var(--local-size-dialog-padding) * -1) calc(var(--local-size-dialog-padding) * -1) ${sizes(6)}
    calc(var(--local-size-dialog-padding) * -1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background-color: ${cVar('colorBackgroundMuted')};

  > * {
    width: 100%;
    height: 208px;

    ${media.sm} {
      height: 264px;
    }
  }
`

export const LottieContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: ${zIndex.nearOverlay};
  display: flex;
  justify-content: center;
`

export const ContentWrapper = styled.div`
  text-align: center;
`
