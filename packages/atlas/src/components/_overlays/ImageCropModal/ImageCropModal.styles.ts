import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Slider } from '@/components/_inputs/Slider'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { oldColors, sizes } from '@/styles'

export const StyledDialogModal = styled(DialogModal)`
  width: 536px;
`

const roundedCropperCss = css`
  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }
`

export const AlignInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: ${sizes(4)};
`

export const AlignInfo = styled(Text)`
  margin-left: ${sizes(2)};
`

export const HiddenInput = styled.input`
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: -99999px;
  left: -99999px;
`

const cropAreaSizeCss = css`
  width: 100%;
  height: 256px;
`

export const CropContainer = styled.div<{ rounded?: boolean; disabled?: boolean }>`
  ${cropAreaSizeCss};

  ${({ rounded }) => rounded && roundedCropperCss};

  .cropper-view-box {
    outline: none;

    ::after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      border-radius: ${({ rounded }) => (rounded ? '50%' : '0')};
      box-shadow: inset 0 0 0 2px ${oldColors.transparentWhite[32]};
    }
  }

  .cropper-modal {
    background-color: ${oldColors.transparentBlack[54]};
  }

  pointer-events: ${({ disabled }) => disabled && 'none'};
`

export const StyledImage = styled.img`
  display: block;
  max-width: 100%;
`

export const ZoomControl = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 2;
`

export const StyledSlider = styled(Slider)`
  margin: 0 ${sizes(4)};
  flex: 1;
`
