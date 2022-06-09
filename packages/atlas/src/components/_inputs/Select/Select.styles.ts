import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import { InputSize, getBaseInputStyles, getInputPadding, sharedInputStyles } from '../inputs.utils'

export const SelectWrapper = styled.div`
  width: 100%;
  position: relative;
`

export const SelectMenuWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const InlineLabel = styled(Text)`
  white-space: nowrap;
`

export const ValueAndPlaceholderText = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 ${sizes(1)};
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

  ${({ isOpen }) => isOpen && sharedInputStyles.focus};

  :focus {
    ${NodeContainer} {
      > svg > path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }
`

export const SelectChevronWrapper = styled.div`
  margin-left: auto;
`

export const SelectMenu = styled.div`
  width: 100%;
  position: relative;
`
