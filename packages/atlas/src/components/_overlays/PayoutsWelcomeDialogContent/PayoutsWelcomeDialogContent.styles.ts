import styled from '@emotion/styled'

import { SvgOtherSignInDialogPatterns, SvgSmallTokens } from '@/assets/illustrations'
import { cVar, sizes, square, zIndex } from '@/styles'

export const Wrapper = styled.div`
  text-align: center;
`

export const IllustrationWrapper = styled.div`
  position: relative;
  height: 270px;
  background-color: ${cVar('colorBackground')};
  margin: calc(var(--local-size-dialog-padding) * -1) calc(var(--local-size-dialog-padding) * -1) ${sizes(6)}
    calc(var(--local-size-dialog-padding) * -1);
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledSvgOtherSignInDialogPatterns = styled(SvgOtherSignInDialogPatterns)`
  position: absolute;
`

export const StyledSvgSmallTokens = styled(SvgSmallTokens)`
  z-index: ${zIndex.overlay};
  ${square('216px')};
`
