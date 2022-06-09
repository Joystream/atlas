import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes, zIndex } from '@/styles'

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
  text-overflow: ellipsis;
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

type SelectMenuProps = {
  isOpen?: boolean
}

export const SelectMenu = styled.ul<SelectMenuProps>`
  width: 100%;
  max-height: 300px;
  position: absolute;
  overflow-y: auto;
  margin-top: 0;
  z-index: ${zIndex.globalOverlay};
  padding: 0;
  background-color: ${cVar('colorCoreNeutral700')};
  color: ${cVar('colorCoreBaseWhite')};
  list-style: none;
`
type SelectOptionProps = {
  isSelected?: boolean
}

export const SelectOption = styled.li<SelectOptionProps>`
  display: flex;
  align-items: center;
  margin: 0;
  cursor: pointer;
  padding: ${sizes(2.5)};
  font: ${cVar('typographyDesktopT200')};
  letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200TextTransform')};
  background-color: ${({ isSelected }) => (isSelected ? cVar('colorCoreNeutral600') : 'none')};

  :hover {
    background-color: ${cVar('colorCoreNeutral600')};
  }

  *:first-of-type {
    margin-right: ${sizes(2)};
  }
`
