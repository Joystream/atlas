import { colors, sizes, transitions, typography } from '@/shared/theme'
import styled from '@emotion/styled'
import { labelOnTop, LabelText, styledinputStates } from '../InputBase'

export const SelectWrapper = styled.div`
  width: 100%;
  position: relative;
`
type SelectButtonProps = {
  isOpen?: boolean
  filled?: boolean
  error?: boolean
  disabled?: boolean
}

export const SelectButton = styled.button<SelectButtonProps>`
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 42px;
  border: none;
  background: none;
  color: ${({ filled }) => (filled ? colors.gray[200] : colors.gray[400])};
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${styledinputStates.default}

  ${({ error }) => error && styledinputStates.error};
  ${({ disabled }) => disabled && styledinputStates.disabled};

  ${({ isOpen }) => isOpen && styledinputStates.focused};
  :focus {
    ${styledinputStates.focused};
  }

  svg {
    transition: all ${transitions.timings.regular} ${transitions.easing};
    transform: rotate(${({ isOpen }) => (isOpen ? 180 : 0)}deg);
    color: ${({ isOpen }) => (isOpen ? colors.blue[400] : 'inherit')};
    margin-left: auto;
  }
`

export const StyledLabelText = styled(LabelText)`
  ${labelOnTop};
`
type SelectMenuProps = {
  isOpen?: boolean
}

export const SelectMenu = styled.ul<SelectMenuProps>`
  width: 100%;
  position: absolute;
  padding: 0;
  margin-top: ${({ isOpen }) => (isOpen ? sizes(1) : 0)};
  background-color: ${colors.gray[700]};
  color: ${colors.white};
  list-style: none;
`
type SelectOptionProps = {
  isSelected?: boolean
}

export const SelectOption = styled.li<SelectOptionProps>`
  margin: 0;
  cursor: pointer;
  padding: ${sizes(2)} ${sizes(3)};
  font-size: ${typography.sizes.subtitle2};
  background-color: ${({ isSelected }) => (isSelected ? colors.gray[600] : 'none')};

  :hover {
    background-color: ${colors.gray[600]};
  }
`
