import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export type ReactionChipState = 'default' | 'disabled' | 'processing' | 'read-only'
type ReactionChipButtonProps = {
  state: ReactionChipState
  active: boolean
}

const getStaticBackground = (props: ReactionChipButtonProps) => {
  switch (props.state) {
    case 'processing':
      return props.active ? cVar('colorBackgroundStrongAlpha') : cVar('colorBackgroundAlpha')
    default:
    case 'default':
    case 'disabled':
      return props.active ? cVar('colorBackgroundStrongAlpha') : 'none'
  }
}

const getHoverStyles = (props: ReactionChipButtonProps) => css`
  :hover,
  :focus {
    background: ${cVar('colorBackgroundStrongAlpha')};
    box-shadow: ${props.active ? `inset 0 0 0 1px ${cVar('colorBorderStrongAlpha')}` : 'none'};
  }

  :active {
    background: ${cVar('colorBackgroundAlpha')};
    box-shadow: ${props.active ? `inset 0 0 0 1px ${cVar('colorBorderAlpha')}` : 'none'};
  }
`

export const ReactionChipButton = styled.button<ReactionChipButtonProps>`
  border: none;
  background: ${getStaticBackground};
  box-shadow: ${({ active }) => (active ? `inset 0 0 0 1px ${cVar('colorBackgroundStrongAlpha')}` : 'none')};
  cursor: ${({ state }) => (state === 'disabled' || state === 'read-only' ? 'not-allowed' : 'pointer')};
  opacity: ${({ state }) => (state === 'disabled' ? 0.5 : 1)};
  height: 32px;
  padding: ${sizes(2)};
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ state }) => state === 'default' && getHoverStyles};
`

export const EmojiContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 16px;
  max-height: 16px;

  /* TODO remove this media query once we implement tweemoji */

  /* this is added because chrome has some issue with rendering emojis */

  /* https://stackoverflow.com/questions/42016125/emoji-rendered-in-chrome-have-different-widths-than-in-other-browsers/44145771#44145771 */
  /* stylelint-disable-next-line  media-feature-name-no-unknown */
  @media not screen and (min-device-pixel-ratio: 2), not screen and (min-resolution: 192dpi) {
    transform: translateX(-2px);
  }
`
