import styled from '@emotion/styled'

import { SvgActionPlus } from '@/assets/icons'
import { AssetImage } from '@/components/AssetImage'
import { cVar, sizes, zIndex } from '@/styles'

export const ComboBoxWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const ListWrapper = styled.ul<{ isOpen: boolean }>`
  max-height: 188px;
  overflow-y: auto;
  box-shadow: ${cVar('effectElevation16Layer1')}, ${cVar('effectElevation16Layer2')};
  background: ${cVar('colorBackgroundStrong')};
  padding: ${({ isOpen }) => sizes(+isOpen)} 0;
  width: 100%;
  z-index: ${zIndex.globalOverlay};
  margin: 0;
`

export const StyledThumbnail = styled(AssetImage)`
  max-height: 32px;
`

export const StyledSvgActionPlus = styled(SvgActionPlus)`
  path {
    fill: ${cVar('colorTextMuted')} !important;
  }
`
