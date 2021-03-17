import { Button, Placeholder, Slider, Text } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import ActionDialog from '../ActionDialog'

export const StyledActionDialog = styled(ActionDialog)`
  max-width: 536px;
`

const roundedCropperCss = css`
  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }
`

export const HeaderContainer = styled.div`
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray['500']};
`

export const HeaderText = styled(Text)`
  padding: ${sizes(2.5)} 0;
`

export const AlignInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${sizes(4)} 0;
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
      border-radius: ${({ rounded }) => (rounded ? '50%' : '0')};

      box-shadow: inset 0 0 0 2px rgba(256, 256, 256, 0.32);
    }
  }

  .cropper-modal {
    background-color: ${colors.black};
    opacity: 0.54;
  }
`

export const StyledImage = styled.img`
  display: block;

  max-width: 100%;
`

export const ZoomControl = styled.div`
  display: flex;
  align-items: center;
`

export const StyledSlider = styled(Slider)`
  margin: 0 ${sizes(4)};
  flex: 1;
`
