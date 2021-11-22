import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { media, oldColors, sizes, transitions } from '@/styles'

type ControlButtonProps = {
  showTooltipOnlyOnFocus?: boolean
  disableFocus?: boolean
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

  & > svg {
    filter: drop-shadow(0 1px 2px ${oldColors.transparentBlack[32]});
    width: 1.5em;
    height: 1.5em;
  }

  :active {
    background-color: ${oldColors.transparentPrimary[10]};
    backdrop-filter: blur(${sizes(8)});
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
        cursor: pointer;
        background-color: ${oldColors.transparentPrimary[18]};
        backdrop-filter: blur(${sizes(8)});

        ${() => ControlButtonTooltip} {
          opacity: ${({ showTooltipOnlyOnFocus }) => (showTooltipOnlyOnFocus ? 0 : 1)};
        }
      }
    }

    :active {
      ${media.xs} {
        background-color: ${oldColors.transparentPrimary[10]};
      }
    }

    :focus {
      /* Provide a fallback style for browsers
    that don't support :focus-visible e.g safari */
      box-shadow: inset 0 0 0 3px ${oldColors.transparentPrimary[18]};
      ${() => ControlButtonTooltip} {
        opacity: ${({ disableFocus }) => (disableFocus ? 0 : 1)};
      }
    }

    :focus-visible {
      box-shadow: inset 0 0 0 3px ${oldColors.transparentPrimary[18]};
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

type ControlButtonTooltipProps = {
  tooltipPosition?: 'left' | 'right'
}

export const ControlButtonTooltip = styled.div<ControlButtonTooltipProps>`
  ${({ tooltipPosition }) => tooltipPosition === 'left' && 'left: 0'};
  ${({ tooltipPosition }) => tooltipPosition === 'right' && 'right: 0'};

  display: none;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  bottom: 3em;
  background: ${oldColors.transparentBlack[54]};
  backdrop-filter: blur(${sizes(8)});
  align-items: center;
  padding: 0.5em;
  white-space: nowrap;
  transition: opacity ${transitions.timings.player} ease-in, backdrop-filter ${transitions.timings.player} ease-in;
  ${media.xs} {
    display: flex;
  }
`

export const ControlButtonTooltipText = styled(Text)`
  /* 12px */
  font-size: 0.75em;
`
