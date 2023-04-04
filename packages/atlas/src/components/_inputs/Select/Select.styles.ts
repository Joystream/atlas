import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes, zIndex } from '@/styles'

import { InputSize, getBaseInputStyles, getInputPadding, getSharedInputStyles } from '../inputs.utils'

export const SelectWrapper = styled.div`
  width: 100%;
  position: relative;
`

export const SelectMenuWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: ${cVar('radiusSmall')};
  overflow: hidden;
`

export const InlineLabel = styled(Text)`
  white-space: nowrap;
  margin-right: ${sizes(1)};
`

export const ValueAndPlaceholderText = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: ${sizes(2)};
  white-space: nowrap;
`

type SelectButtonProps = {
  isOpen?: boolean
  error?: boolean
  disabled?: boolean
  inputSize: InputSize
}

export const NodeContainer = styled.div<{ isOpen?: boolean }>`
  display: flex;
  align-items: center;
  margin-right: ${sizes(2)};

  > svg > path {
    fill: ${({ isOpen }) => (isOpen ? cVar('colorTextStrong') : cVar('colorText'))};
    transition: ${cVar('animationTransitionFast')};
  }
`

export const SelectButton = styled.button<SelectButtonProps>`
  width: 100%;
  text-align: left;
  display: flex;
  justify-items: start;
  align-items: center;
  min-height: 40px;

  ${getInputPadding};
  ${getBaseInputStyles}

  ${({ isOpen }) => isOpen && getSharedInputStyles().focus};

  :focus {
    ${NodeContainer} {
      > svg > path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }

  /* overwrite hover styles when input is open */

  :hover:not(:disabled):not(:focus) {
    ${({ isOpen, error }) => (isOpen ? getSharedInputStyles().focus : error ? null : getSharedInputStyles().hover)};
  }
`

export const SelectChevronWrapper = styled.div`
  margin-left: auto;
`

export const SelectMenu = styled.div`
  z-index: ${zIndex.snackbars};
`
