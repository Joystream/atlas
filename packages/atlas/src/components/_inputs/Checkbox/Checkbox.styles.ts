import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionCheck } from '@/assets/icons'
import { cVar, sizes, square, zIndex } from '@/styles'

export const Container = styled.div`
  position: relative;
  z-index: 0;
  width: max-content;
  padding: ${sizes(2)};
  margin: -${sizes(2)};
  cursor: pointer;
  border-radius: 100%;
  color: ${cVar('colorCoreNeutral300')};
`

export const Checkmark = styled.div<{ error: boolean }>`
  ${square('16px')};

  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${cVar('animationTransitionFast')};
  border: 1px solid ${({ error }) => cVar(error ? 'colorBorderError' : 'colorBorderAlpha')};
  border-radius: ${cVar('radiusSmall')};
  position: relative;

  ::before {
    content: '';
    display: block;
    position: absolute;
    top: -9px;
    bottom: -9px;
    left: -9px;
    right: -9px;
    z-index: -1;
    border-radius: 50%;
  }
`

type CheckboxInputProps = {
  error: boolean
}
const hoverCheckedStyles = ({ error }: CheckboxInputProps) => css`
  + ${Checkmark} {
    background-color: ${cVar(error ? 'colorBackgroundErrorStrong' : 'colorBackgroundPrimaryStrong')};

    ::before {
      background-color: ${cVar('colorBackgroundStrongAlpha')};
    }
  }
`
const hoverUncheckedStyles = css`
  + ${Checkmark} {
    ::before {
      background-color: ${cVar('colorBackgroundStrongAlpha')};
    }
  }
`
export const CheckboxInput = styled.input<CheckboxInputProps>`
  ${square('100%')};

  top: 0;
  left: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
  cursor: inherit;
  z-index: ${zIndex.overlay};

  :not(:checked) {
    + ${Checkmark} {
      background-color: ${cVar('colorBackgroundMutedAlpha')};
    }
  }

  :disabled:not(:checked) {
    + ${Checkmark} {
      background-color: ${cVar('colorBackgroundAlpha')};
      border: 1px solid ${cVar('colorBorderMutedAlpha')};
    }
  }

  :disabled:checked {
    + ${Checkmark} {
      background-color: ${cVar('colorBackgroundStrongAlpha')};
      border: 0;

      path {
        fill: ${cVar('colorTextMuted')};
      }
    }
  }

  :checked:disabled {
    + ${Checkmark} {
      background-color: ${cVar('colorBackgroundStrongAlpha')};
    }
  }

  :checked:not(:disabled) {
    :hover {
      ${hoverCheckedStyles}
    }

    :active {
      + ${Checkmark} {
        background-color: ${({ error }) => cVar(error ? 'colorBackgroundErrorMuted' : 'colorBackgroundPrimaryMuted')};

        ::before {
          background-color: ${cVar('colorBackgroundAlpha')};
        }
      }
    }

    + ${Checkmark} {
      background-color: ${({ error }) => cVar(error ? 'colorBackgroundError' : 'colorBackgroundPrimary')};
      border: 0;

      ::before {
        top: -8px;
        bottom: -8px;
        left: -8px;
        right: -8px;
      }
    }
  }

  :active:not(:checked):not(:disabled) {
    + ${Checkmark} {
      border: 1px solid ${cVar('colorBorderStrongAlpha')};

      ::before {
        background-color: ${cVar('colorBackgroundAlpha')};
      }
    }
  }

  :hover:not(:disabled):not(:active) {
    ${hoverUncheckedStyles}
  }

  @supports selector(:focus-visible) {
    :focus-visible:not(:disabled):not(:checked) {
      ${hoverUncheckedStyles};
    }

    :focus-visible:checked:not(:disabled):not(:active) {
      ${hoverCheckedStyles};
    }
  }

  @supports selector(not(:focus-visible)) {
    :focus:not(:disabled):not(:checked) {
      ${hoverUncheckedStyles};
    }

    :focus:checked:not(:disabled):not(:active) {
      ${hoverCheckedStyles};
    }
  }
`

export const StyledGlyphCheck = styled(SvgActionCheck)`
  position: absolute;
`
