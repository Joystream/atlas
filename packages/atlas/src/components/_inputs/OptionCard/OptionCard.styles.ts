import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

type OptionCardLabelProps = {
  checked?: boolean
  disabled?: boolean
  error?: boolean
}

const getOptionCardBorderColor = ({ checked, error, disabled }: OptionCardLabelProps) => {
  if (disabled) {
    return cVar('colorBorderMutedAlpha')
  }
  if (error) {
    return cVar('colorBorderError')
  } else if (checked) {
    return cVar('colorBorderPrimary')
  }
  return cVar('colorBorderMutedAlpha')
}

const getOptionCardBorderColorHover = ({ checked, error, disabled }: OptionCardLabelProps) => {
  if (disabled) {
    return cVar('colorBorderMutedAlpha')
  }
  if (error) {
    return cVar('colorBorderError')
  } else if (checked) {
    return cVar('colorBorderPrimary')
  }
  return cVar('colorBorderAlpha')
}

const getOptionCardBorderColorActive = ({ checked, error, disabled }: OptionCardLabelProps) => {
  if (disabled) {
    return cVar('colorBorderMutedAlpha')
  }
  if (error) {
    return cVar('colorBorderError')
  } else if (checked) {
    return cVar('colorBorderPrimary')
  }
  return cVar('colorBorderStrongAlpha')
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
  --underline-y: ${({ checked }) => (checked ? '0' : '1px')};

  padding: ${sizes(4)};
  display: flex;
  flex-direction: column;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all ${cVar('animationTransitionFast')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  background: ${cVar('colorBackgroundMutedAlpha')};
  border-radius: ${cVar('radiusSmall')};
  overflow: hidden;
  position: relative;

  .underline {
    transition: ${cVar('animationTransitionFast')};
    transition-property: background-color, transform;
    width: 100%;
    background-color: ${getOptionCardBorderColor};
    position: absolute;
    height: 2px;
    left: 0;
    bottom: 0;
    transform: translateY(var(--underline-y));
  }

  ${({ disabled, checked, error }) =>
    !disabled &&
    css`
      :focus-within,
      :hover {
        background: ${cVar('colorBackgroundAlpha')};

        .underline {
          background-color: ${getOptionCardBorderColorHover({ checked, error, disabled })};
        }

        ${IconContainer} {
          * path {
            fill: ${error ? cVar('colorTextError') : !disabled ? cVar('colorTextStrong') : cVar('colorText')};
          }
        }
      }
    `}

  :active {
    background: ${cVar('colorBackgroundMutedAlpha')};
  }

  :active .underline {
    background-color: ${getOptionCardBorderColorActive};
  }
`

export const InputAndTitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${sizes(2)};
`

export const TitleIconWrapper = styled.div`
  display: flex;
  gap: 0 ${sizes(2)};
  align-items: center;
  margin-right: ${sizes(4)};
  min-width: 0;
`

export const OptionCardTitle = styled(Text)`
  /* stylelint-disable */
  display: -webkit-box;
  /* stylelint-enable */
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`
