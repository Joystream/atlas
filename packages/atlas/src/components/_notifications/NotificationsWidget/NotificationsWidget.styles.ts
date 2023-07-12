import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { cVar, media, sizes, square, zIndex } from '@/styles'

export const MobileBackdrop = styled.div`
  background-color: transparent;
  inset: 0;
  position: fixed;
  z-index: ${zIndex.globalOverlay};
`

export const Wrapper = styled.div`
  width: 100vw;
  background-color: ${cVar('colorBackgroundStrong')};
  border-radius: ${cVar('radiusLarge')};
  ${media.sm} {
    left: 0;
    width: 400px;
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

export const KebabMenuButtonIcon = styled(Button)`
  ${square(32)};
`

export const StyledContextMenu = styled(ContextMenu)`
  ul {
    width: max-content;
  }
`
