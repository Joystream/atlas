import styled from '@emotion/styled'

import { SvgActionPlus } from '@/assets/icons'
import { cVar, sizes, zIndex } from '@/styles'

export const ComboBoxWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const ListWrapper = styled.ul<{ y?: number; left?: number; width?: number; isOpen: boolean }>`
  max-height: 188px;
  overflow-y: auto;
  box-shadow: ${cVar('effectElevation16Layer1')}, ${cVar('effectElevation16Layer2')};
  background: ${cVar('colorBackgroundStrong')};
  padding: ${({ isOpen }) => sizes(+isOpen)} 0;
  position: absolute;
  top: ${({ y }) => (y ? `${y}px` : 'unset')};
  left: ${({ left }) => (left ? `${left}px` : 'unset')};
  width: ${({ width }) => (width ? `${width}px` : 'unset')};
  z-index: ${zIndex.snackbars};
  margin: 0;
`

export const StyledThumbnail = styled.img`
  max-height: 32px;
`

export const StyledSvgActionPlus = styled(SvgActionPlus)`
  path {
    fill: ${cVar('colorTextMuted')} !important;
  }
`
