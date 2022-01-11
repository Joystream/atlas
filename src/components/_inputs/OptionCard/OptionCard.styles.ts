import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { CustomRadioInput, activeState, hoverState } from '@/components/_inputs/RadioInput/RadioInput.styles'
import { cVar, oldColors, sizes } from '@/styles'

type OptionCardLabelProps = {
  checked?: boolean
  disabled?: boolean
  error?: boolean
}

const getOptionCardBorderColor = ({ checked, error }: OptionCardLabelProps) => {
  if (error) {
    return oldColors.secondary.alert[100]
  } else if (checked && !error) {
    return oldColors.blue[500]
  }
  return oldColors.gray[500]
}

const IconStyles = ({ error, checked, disabled }: OptionCardLabelProps) => css`
  * path {
    transition: fill ${cVar('animationTransitionFast')};
    fill: ${error
      ? cVar('colorTextError')
      : checked && !disabled
      ? cVar('colorCoreNeutral50')
      : cVar('colorCoreNeutral300')};
  }
`

export const IconContainer = styled.div<OptionCardLabelProps>`
  ${IconStyles}
`

export const OptionCardLabel = styled.label<OptionCardLabelProps>`
  padding: ${sizes(4)};
  display: flex;
  flex-direction: column;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid ${getOptionCardBorderColor};
  transition: background-color ${cVar('animationTransitionFast')}, border-color ${cVar('animationTransitionFast')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  :hover {
    border: ${({ checked, disabled, error }) => !checked && !disabled && !error && `1px solid ${oldColors.gray[300]}`};
    ${CustomRadioInput} {
      ${({ checked, disabled, error }) => !disabled && !error && hoverState(checked)};
    }

    ${IconContainer} {
      * path {
        fill: ${({ error, disabled }) =>
          error ? cVar('colorTextError') : !disabled ? cVar('colorCoreNeutral50') : cVar('colorCoreNeutral300')};
      }
    }
  }

  :active {
    border: ${({ checked, disabled, error }) => !checked && !disabled && !error && `1px solid ${oldColors.gray[50]}`};
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

export const TitleIconWrapper = styled.div`
  display: flex;
  gap: 0 ${sizes(2)};
  align-items: center;
`

export const OptionCardTitle = styled(Text)`
  margin-right: ${sizes(2)};
`
