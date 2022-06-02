import { css } from '@emotion/react'
import styled from '@emotion/styled/'

import { SvgActionCheck } from '@/components/_icons'
import { cVar, sizes } from '@/styles'

export const Container = styled.div<CheckboxStateProps>`
  position: relative;
  width: max-content;
  padding: ${sizes(2)};
  margin: -${sizes(2)};
  cursor: pointer;
  border-radius: 100%;
  color: ${cVar('colorCoreNeutral300')};
  transition: background ${cVar('animationTransitionFast')};

  :hover {
    background: ${({ selected, disabled }) => !(disabled && selected) && cVar('colorBackgroundStrongAlpha')};
  }

  :active {
    background: ${({ selected, disabled }) => !(disabled && selected) && cVar('colorBackgroundAlpha')};
  }
`

const selectedStyles = ({ selected, disabled }: CheckboxStateProps) =>
  selected && !disabled
    ? css`
        background-color: ${selected ? cVar('colorBackgroundPrimary') : 'transparent'};
        border: 1px solid ${cVar('colorBackgroundPrimary')};

        :hover {
          background-color: ${cVar('colorBackgroundPrimaryStrong')};
          border: 1px solid ${cVar('colorBackgroundPrimaryStrong')};
        }

        :active {
          background-color: ${cVar('colorBackgroundPrimaryMuted')};
          border: 1px solid ${cVar('colorBackgroundPrimaryMuted')};
        }
      `
    : null
const disabledStyles = ({ disabled, selected }: CheckboxStateProps) =>
  disabled
    ? [
        css`
          cursor: not-allowed;
          border: 1px solid ${cVar('colorBorderMutedAlpha')};
          background-color: ${cVar('colorBackgroundAlpha')};
        `,
        selected &&
          css`
            background-color: ${cVar('colorCoreNeutral700')};
            border: 1px solid ${cVar('colorCoreNeutral700')};
            color: ${cVar('colorCoreNeutral400')};

            path {
              fill: ${cVar('colorTextMuted')};
            }
          `,
      ]
    : null
const errorStyles = ({ error, selected }: CheckboxStateProps) =>
  error
    ? [
        css`
          border: 1px solid ${cVar('colorBorderError')};
        `,
        selected &&
          css`
            background-color: ${cVar('colorBackgroundError')};
            border: 1px solid ${cVar('colorBackgroundError')};

            :hover {
              background-color: ${cVar('colorBackgroundErrorStrong')};
              border: 1px solid ${cVar('colorBackgroundErrorStrong')};
            }

            :active {
              background-color: ${cVar('colorBackgroundErrorMuted')};
              border: 1px solid ${cVar('colorBackgroundErrorMuted')};
            }
          `,
      ]
    : null
export type CheckboxStateProps = {
  selected: boolean
  disabled: boolean
  error: boolean
  isFocused: boolean
}
export const InnerContainer = styled.div<CheckboxStateProps>`
  transition: all ${cVar('animationTransitionFast')};
  border: 1px solid ${cVar('colorBorderAlpha')};
  border-radius: ${cVar('radiusSmall')};
  ${selectedStyles};
  ${errorStyles};
  ${disabledStyles};
`

export const Input = styled.input`
  top: 0;
  left: 0;
  margin: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: inherit;
`

export const Checkmark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 1px;
`

export const StyledGlyphCheck = styled(SvgActionCheck)`
  position: absolute;
`
