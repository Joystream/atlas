import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import { Text } from '../Text'

type OptionCardLabelProps = {
  selected?: boolean
  disabled?: boolean
  error?: boolean
}

const getOptionCardBorderColor = ({ selected, disabled, error }: OptionCardLabelProps) => {
  if (disabled) {
    return colors.gray[500]
  } else if (error) {
    return colors.error
  } else if (selected && !error) {
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

export const OptionCardTitle = styled(Text)`
  margin-right: ${sizes(2)};
`
