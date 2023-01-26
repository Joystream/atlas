import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, media, sizes, transitions } from '@/styles'

type ControlButtonProps = {
  showTooltipOnlyOnFocus?: boolean
  disableFocus?: boolean
  isDisabled?: boolean
}

export const ControlButton = styled.button<ControlButtonProps>`
  display: flex;
  padding: 0.5em;
  border: none;
  background: none;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background ${transitions.timings.player} ease-in;
  ${({ isDisabled }) =>
    isDisabled &&
    css`
      opacity: 0.5;
    `}

  & > svg {
    filter: ${cVar('filterEffectElevation1Layer1')};
    width: 1.5em;
    height: 1.5em;
  }

  @media (hover: hover) {
    :hover,
    :focus,
    :focus-visible {
      /* turn off transition on mouse enter, but turn on on mouse leave */
      transition: none;
      ${() => ControlButtonTooltip} {
        transition: none;
      }
    }

    :hover {
      ${media.xs} {
        cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
        background-color: ${({ isDisabled }) => (isDisabled ? 'none' : cVar('colorBackgroundStrongAlpha'))};
        backdrop-filter: ${({ isDisabled }) => (isDisabled ? 'none' : `blur(${sizes(8)}) `)};

        ${() => ControlButtonTooltip} {
          opacity: ${({ showTooltipOnlyOnFocus }) => (showTooltipOnlyOnFocus ? 0 : 1)};
        }
      }
    }

    :active {
      background-color: ${({ isDisabled }) => (isDisabled ? 'none' : cVar('colorBackgroundAlpha'))};
      backdrop-filter: ${({ isDisabled }) => (isDisabled ? 'none' : `blur(${sizes(8)}) `)};
    }

    :focus {
      /* Provide a fallback style for browsers
    that don't support :focus-visible e.g safari */
      box-shadow: inset 0 0 0 3px ${cVar('colorBorderMutedAlpha')};
      ${() => ControlButtonTooltip} {
        opacity: ${({ disableFocus }) => (disableFocus ? 0 : 1)};
      }
    }

    :focus-visible {
      box-shadow: inset 0 0 0 3px ${cVar('colorBorderMutedAlpha')};
      ${() => ControlButtonTooltip} {
        opacity: ${({ disableFocus }) => (disableFocus ? 0 : 1)};
      }
    }

    :focus:not(:focus-visible) {
      box-shadow: unset;
    }

    :hover:focus {
      ${() => ControlButtonTooltip} {
        opacity: 1;
      }
    }

    :focus:not(:focus-visible):hover {
      ${() => ControlButtonTooltip} {
        opacity: ${({ showTooltipOnlyOnFocus }) => (showTooltipOnlyOnFocus ? 0 : 1)};
      }
    }

    :focus:not(:focus-visible):not(:hover) {
      ${() => ControlButtonTooltip} {
        opacity: 0;
      }
    }
  }
`
export type TooltipPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type ControlButtonTooltipProps = {
  tooltipPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const tooltipPositionStyles: Record<TooltipPosition, SerializedStyles> = {
  'top-left': css`
    left: 0;
    bottom: 3em;
  `,
  'top-right': css`
    right: 0;
    bottom: 3em;
  `,
  'bottom-right': css`
    right: 0;
    top: 3em;
  `,
  'bottom-left': css`
    left: 0;
    top: 3em;
  `,
}

export const ControlButtonTooltip = styled.div<ControlButtonTooltipProps>`
  display: none;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  background: ${cVar('colorBackgroundOverlay')};
  backdrop-filter: blur(${sizes(8)});
  padding: 0.5em;
  white-space: nowrap;
  transition: opacity ${transitions.timings.player} ease-in, backdrop-filter ${transitions.timings.player} ease-in;

  ${({ tooltipPosition }) => tooltipPositionStyles[tooltipPosition]};

  ${media.xs} {
    align-items: center;
    display: flex;
  }
`

export const ControlButtonTooltipText = styled(Text)`
  /* 12px */
  font-size: 0.75em;
  white-space: nowrap;
`
