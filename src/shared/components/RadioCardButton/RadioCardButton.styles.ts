import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import { Text } from '../Text'

type RadioCardLabelProps = {
  selected?: boolean
  disabled?: boolean
  error?: boolean
}

const getRadioCardBorderColor = ({ selected, disabled, error }: RadioCardLabelProps) => {
  if (disabled) {
    return colors.gray[500]
  } else if (error) {
    return colors.error
  } else if (selected && !error) {
    return colors.blue[500]
  }
  return colors.gray[500]
}

export const RadioCardLabel = styled.label<RadioCardLabelProps>`
  padding: ${sizes(4)};
  display: flex;
  flex-direction: column;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid ${getRadioCardBorderColor};
  transition: background-color 0.25s ease, border-color 0.25s ease;

  :hover {
    border: ${({ selected, disabled, error }) => !selected && !disabled && !error && `1px solid ${colors.gray[300]}`};
  }

  :active {
    border: ${({ selected, disabled, error }) => !selected && !disabled && !error && `1px solid ${colors.gray[50]}`};
  }
`

export const InputAndTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${sizes(4)};
`

export const RadioCardTitle = styled(Text)`
  margin-right: ${sizes(2)};
`
