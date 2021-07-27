import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes, transitions } from '@/shared/theme'

import { Text } from '../Text'

type ControlButtonProps = {
  showTooltipOnlyOnFocus?: boolean
  disableFocus?: boolean
}

const focusStyles = css`
  :focus {
    /* Provide a fallback style for browsers
     that don't support :focus-visible e.g safari */
    box-shadow: inset 0 0 0 3px ${colors.transparentPrimary[18]};
  }

  /* https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible */

  :focus-visible {
    box-shadow: inset 0 0 0 3px ${colors.transparentPrimary[18]};
  }

  :focus:not(:focus-visible) {
    box-shadow: unset;
  }
`

export const ControlButton = styled.button<ControlButtonProps>`
  margin-right: 0.5em;
  display: flex !important;
  padding: 0.5em;
  cursor: pointer;
  border: none;
  background: none;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background ${transitions.timings.player} ease-in !important;

  & > svg {
    filter: drop-shadow(0 1px 2px ${colors.transparentBlack[32]});
    width: 1.5em;
    height: 1.5em;
  }

  :hover {
    background-color: ${colors.transparentPrimary[18]};
    backdrop-filter: blur(${sizes(8)});
    transition: none !important;

    ${() => ControlButtonTooltip} {
      transition: none !important;
      opacity: ${({ showTooltipOnlyOnFocus }) => (showTooltipOnlyOnFocus ? 0 : 1)};
    }
  }

  :active {
    background-color: ${colors.transparentPrimary[10]};
  }

  :focus {
    ${() => ControlButtonTooltip} {
      /* turn off transition on mouse enter, but turn on on mouse leave */
      transition: none !important;
      opacity: ${({ disableFocus }) => (disableFocus ? 0 : 1)};
    }
  }

  :focus-visible {
    ${() => ControlButtonTooltip} {
      opacity: ${({ disableFocus }) => (disableFocus ? 0 : 1)};
    }
  }

  :focus:not(:focus-visible):hover {
    ${() => ControlButtonTooltip} {
      transition: none !important;
      opacity: ${({ showTooltipOnlyOnFocus }) => (showTooltipOnlyOnFocus ? 0 : 1)};
    }
  }

  :focus:not(:focus-visible):not(:hover) {
    ${() => ControlButtonTooltip} {
      opacity: 0;
    }
  }

  ${focusStyles}
`

type ControlButtonTooltipProps = {
  tooltipPosition?: 'left' | 'right'
}

export const ControlButtonTooltip = styled.div<ControlButtonTooltipProps>`
  ${({ tooltipPosition }) => tooltipPosition === 'left' && 'left: 0'};
  ${({ tooltipPosition }) => tooltipPosition === 'right' && 'right: 0'};

  opacity: 0;
  pointer-events: none;
  position: absolute;
  bottom: calc(3em);
  background: ${colors.transparentBlack[54]};
  backdrop-filter: blur(${sizes(8)});
  display: flex;
  align-items: center;
  padding: 0.5em;
  white-space: nowrap;
  transition: opacity ${transitions.timings.player} ease-in, backdrop-filter ${transitions.timings.player} ease-in !important;
`

export const ControlButtonTooltipText = styled(Text)`
  /* 12px */
  font-size: 0.75em;
`
