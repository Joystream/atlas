import styled from '@emotion/styled'
import ActionDialog from '../ActionDialog'
import { css } from '@emotion/react'
import { Placeholder } from '@/shared/components'

export const HiddenInput = styled.input`
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: -99999px;
  left: -99999px;
`

export const StyledActionDialog = styled(ActionDialog)`
  max-width: 536px;
`

const roundedCropperCss = css`
  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }
`

const cropAreaSizeCss = css`
  width: 100%;
  height: 256px;
`

export const CropPlaceholder = styled(Placeholder)`
  ${cropAreaSizeCss};
`

export const CropContainer = styled.div<{ rounded?: boolean }>`
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
      border-radius: 50%;

      box-shadow: inset 0 0 0 2px rgba(187, 231, 255, 0.48);
    }
  }

  .cropper-modal {
    background-color: #5a666f;
    opacity: 0.8;
  }
`

export const StyledImage = styled.img`
  display: block;

  max-width: 100%;
`
