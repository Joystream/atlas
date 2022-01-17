import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { CustomRadioInput, activeState, hoverState } from '@/components/_inputs/RadioInput/RadioInput.styles'
import { cVar, sizes } from '@/styles'

type OptionCardLabelProps = {
  checked?: boolean
  disabled?: boolean
  error?: boolean
}

const getOptionCardBorderColor = ({ checked, error }: OptionCardLabelProps) => {
  if (error) {
    return cVar('colorCoreRed500')
  } else if (checked && !error) {
    return cVar('colorCoreBlue500')
  }
  return cVar('colorBorderAlpha')
}

const getOptionCardBorderColorHover = ({ checked, error, disabled }: OptionCardLabelProps) => {
  if (disabled) {
    return 'inherit'
  }
  if (error) {
    return cVar('colorCoreRed300')
  } else if (checked && !error) {
    return cVar('colorCoreBlue300')
  }
  return cVar('colorBorderStrongAlpha')
}

const getOptionCardBorderColorActive = ({ checked, error, disabled }: OptionCardLabelProps) => {
  if (disabled) {
    return 'inherit'
  }
  if (error) {
    return cVar('colorCoreRed700')
  } else if (checked && !error) {
    return cVar('colorCoreBlue700')
  }
  return cVar('colorBorderMutedAlpha')
}

const IconStyles = ({ error, checked, disabled }: OptionCardLabelProps) => css`
  * path {
    transition: fill ${cVar('animationTransitionFast')};
    fill: ${error ? cVar('colorTextError') : checked && !disabled ? cVar('colorTextStrong') : cVar('colorText')};
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
    border: 1px solid ${getOptionCardBorderColorHover};
    ${CustomRadioInput} {
      ${({ checked, disabled, error }) => !disabled && !error && hoverState(checked)};
    }

    ${IconContainer} {
      * path {
        fill: ${({ error, disabled }) =>
          error ? cVar('colorTextError') : !disabled ? cVar('colorTextStrong') : cVar('colorText')};
      }
    }
  }

  :active {
    border: 1px solid ${getOptionCardBorderColorActive};
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
  margin-right: ${sizes(4)};
`

export const OptionCardTitle = styled(Text)`
  display: box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`
