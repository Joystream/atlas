import styled from '@emotion/styled'

import {
  SvgLargeComputer,
  SvgLargeWall,
  SvgOtherSignInDialogPatterns,
  SvgOtherSignInMobileDialogPatterns,
} from '@/assets/illustrations'
import { cVar, media, sizes } from '@/styles'

export const IllustrationWrapper = styled.div<{ isMobileDevice: boolean }>`
  position: relative;
  height: ${({ isMobileDevice }) => (isMobileDevice ? '162px' : '180px')};
  background-color: ${cVar('colorBackground')};
  margin: calc(var(--local-size-dialog-padding) * -1) calc(var(--local-size-dialog-padding) * -1) ${sizes(6)}
    calc(var(--local-size-dialog-padding) * -1);
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.sm} {
    height: ${({ isMobileDevice }) => (isMobileDevice ? '216px' : '270px')};
  }
`

export const SignInDialogTextWrapper = styled.div`
  margin: 0 auto;
  text-align: center;
  display: grid;
  grid-auto-rows: auto;
  grid-gap: ${sizes(2)};
`

export const StyledSvgLargeWall = styled(SvgLargeWall)`
  max-width: 256px;
  max-height: 256px;
  display: block;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  ${media.sm} {
    max-width: 320px;
    max-height: 320px;
  }
`

export const StyledLargeComputer = styled(SvgLargeComputer)`
  max-width: 160px;
  max-height: 160px;
  display: block;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  ${media.sm} {
    max-width: 208px;
    max-height: 208px;
  }
`

export const StyledSvgOtherSignInMobileDialogPatterns = styled(SvgOtherSignInMobileDialogPatterns)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
`

export const StyledSvgOtherSignInDialogPatterns = styled(SvgOtherSignInDialogPatterns)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  max-width: 100%;
`
