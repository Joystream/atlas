import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import { InputSize, getBaseInputStyles, inputBorderColors } from '../inputs.utils'

export const TextAreaWrapper = styled.div`
  display: inline-block;
  width: 100%;
`

const baseStyles = {
  medium: css`
    padding: ${sizes(3)} ${sizes(4)};
    font: ${cVar('typographyDesktopT200')};
  `,
  large: css`
    padding: ${sizes(4)} ${sizes(5)};
    font: ${cVar('typographyDesktopT300')};
  `,
}

export const TextAreaContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  border-radius: 2px;
  overflow: hidden;
`

export const CustomBorder = styled.div<{ disabled?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: ${inputBorderColors.default};
  width: 100%;
  height: 1px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: ${cVar('animationTransitionFast')};
  transition-property: transform, background-color, opacity;
`

export const TextAreaStyles = ({ inputSize, error }: { inputSize: InputSize; error?: boolean }) => css`
  width: 100%;
  resize: vertical;
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: unset;

  ${getBaseInputStyles({ error, ignoreBoxShadow: true })}

  :hover:not(:disabled) + ${CustomBorder} {
    background-color: ${error ? inputBorderColors.error : inputBorderColors.hover};
  }

  :focus:not(:disabled) + ${CustomBorder} {
    background-color: ${inputBorderColors.focus};
    transform: scaleY(2);
  }

  ${error &&
  css`
    + ${CustomBorder} {
      background-color: ${inputBorderColors.error};
    }
  `};

  ${baseStyles[inputSize]}

  ::-webkit-scrollbar-corner {
    background: ${cVar('colorCoreNeutral800Lighten')};
  }

  ::placeholder {
    font: inherit;
    opacity: 1;
    color: ${cVar('colorTextMuted')};
  }

  ::-webkit-resizer {
    /* action-resize.svg with updated color */
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M14 7.00003C14 6.59557 13.7564 6.23093 13.3827 6.07615C13.009 5.92137 12.5789 6.00692 12.2929 6.29292L7.29292 11.2929C7.00692 11.5789 6.92137 12.009 7.07615 12.3827C7.23093 12.7564 7.59557 13 8.00003 13H13C13.5523 13 14 12.5523 14 12V7.00003Z' fill='%237B8A95'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 75% 75%;
  }
`

export const StyledTextArea = styled.textarea<{ inputSize: InputSize; error?: boolean }>`
  ${TextAreaStyles}
`

export const StyledText = styled(Text)<{ disabled?: boolean }>`
  margin-top: ${sizes(2)};
  font-feature-settings: 'tnum' on, 'lnum' on;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`
