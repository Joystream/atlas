import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes, zIndex } from '@/styles'

export const MobileBackdrop = styled.div`
  background-color: transparent;
  inset: 0;
  position: fixed;
  z-index: ${zIndex.globalOverlay};
`

export const Wrapper = styled.div`
  width: 100vw;
  background-color: ${cVar('colorBackgroundStrong')};
  ${media.sm} {
    left: 0;
    width: 516px;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(4)};
  box-shadow: ${cVar('effectDividersBottom')};
`

export const Content = styled.div`
  overflow-y: auto;
  overscroll-behavior: contain;
  max-height: 40vh;

  ${media.sm} {
    max-height: 336px;
  }
`

export const StyledButton = styled(Button)`
  box-shadow: ${cVar('effectDividersTop')};
`
