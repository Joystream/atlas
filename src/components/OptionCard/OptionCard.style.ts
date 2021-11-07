import styled from '@emotion/styled'

import { colors, sizes } from '@/theme'

import { CustomRadioInput, activeState, hoverState } from '../RadioInput/RadioInput.style'
import { Text } from '../Text'

type OptionCardLabelProps = {
  checked?: boolean
  disabled?: boolean
  error?: boolean
}

const getOptionCardBorderColor = ({ checked, disabled, error }: OptionCardLabelProps) => {
  if (disabled) {
    return colors.gray[500]
  } else if (error) {
    return colors.secondary.alert[100]
  } else if (checked && !error) {
    return colors.blue[500]
  }
  return colors.gray[500]
}

export const OptionCardLabel = styled.label<OptionCardLabelProps>`
  padding: ${sizes(4)};
  display: flex;
  flex-direction: column;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid ${getOptionCardBorderColor};
  transition: background-color 0.25s ease, border-color 0.25s ease;

  :hover {
    border: ${({ checked, disabled, error }) => !checked && !disabled && !error && `1px solid ${colors.gray[300]}`};
    ${CustomRadioInput} {
      ${({ checked, disabled, error }) => !disabled && !error && hoverState(checked)};
    }
  }

  :active {
    border: ${({ checked, disabled, error }) => !checked && !disabled && !error && `1px solid ${colors.gray[50]}`};
    ${CustomRadioInput} {
      ${({ checked, disabled, error }) => !disabled && !error && activeState(checked)};
    }
  }
`

export const InputAndTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${sizes(4)};
`

export const OptionCardTitle = styled(Text)`
  margin-right: ${sizes(2)};
`
