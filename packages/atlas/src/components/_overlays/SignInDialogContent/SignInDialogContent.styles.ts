import styled from '@emotion/styled'

import {
  SvgLargeComputer,
  SvgLargeWall,
  SvgOtherSignInDialogPatterns,
  SvgOtherSignInMobileDialogPatterns,
} from '@/assets/illustrations'
import { media, sizes } from '@/styles'

export const IllustrationWrapper = styled.div<{ isMobileDevice: boolean }>`
  position: relative;
  margin: calc(var(--local-size-dialog-padding) * -1) calc(var(--local-size-dialog-padding) * -1) ${sizes(6)}
    calc(var(--local-size-dialog-padding) * -1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  > * {
    width: 100%;
    height: 208px;

    ${media.sm} {
      height: 264px;
    }
  }
`

export const SignInDialogTextWrapper = styled.div`
  margin: 0 auto;
  text-align: center;
  display: grid;
  grid-auto-rows: auto;
  grid-gap: ${sizes(2)};
  padding: ${sizes(2)};

  ${media.sm} {
    padding: 0;
  }
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
